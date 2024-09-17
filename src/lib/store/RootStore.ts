import { action, observable, makeObservable } from 'mobx';
import { Client, ClientFactory } from '../clients';
import { showNotification } from '../utils/Notifications';
import {
  Page,
  Inspector,
  InspectorMode,
  SerializedReactDiagram,
} from '../types';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { DiagramModel, NodeModel } from '../diagram';
import { Story, demos } from '@data-story-org/core';

interface Metadata {
  running: boolean;
  page: Page;
  activeInspector: Inspector;
  requestOpenNodeModal: string;
  stories: Story<SerializedReactDiagram>[];
  activeStory: string;
  client: Client;
  demos: Story[];
  confirmationRequired: boolean;
}

interface Diagram {
  engine: DiagramEngine;
  availableNodes: NodeModel[];
  refresh: number;
  nodeSerial: number;
}

export class Store {
  results;

  diagram: Diagram = {
    engine: null,
    availableNodes: [],
    refresh: 0,
    nodeSerial: 1,
  };

  metadata: Metadata = {
    running: false,
    page: 'Workbench',
    activeInspector: {
      nodeId: null,
      mode: 'Table',
    },
    requestOpenNodeModal: null,
    stories: [],
    activeStory: 'Untitled',
    client: ClientFactory((window as any).config),
    demos: [],
    confirmationRequired: false,
  };

  constructor() {
    makeObservable(this, {
      // Observables
      diagram: observable,
      metadata: observable,

      // Setters
      addDemos: action.bound,
      addNode: action.bound,
      clearResults: action.bound,
      importDemo: action.bound,
      increaseNodeSerial: action.bound,
      goToInspector: action.bound,
      navigateDiagram: action.bound,
      openNodeModal: action.bound,
      refreshDiagram: action.bound,
      resetOpenNodeModalRequest: action.bound,
      setActiveInspector: action.bound,
      setActiveInspectorMode: action.bound,
      setActiveStory: action.bound,
      setAvailableNodes: action.bound,
      setEngine: action.bound,
      setPage: action.bound,
      setResults: action.bound,
      setNotRunning: action.bound,
      setRunning: action.bound,
      setStories: action.bound,
      setDiagramLocked: action.bound,
      setConfirmRequired: action.bound,

      // Getters
      getModel: action.bound,

      // Notifications
      showRunFail: action.bound,
      showRunSuccessful: action.bound,
    });
  }

  addDemos(demos: Story[]) {
    this.metadata.demos = demos;
  }

  addNode(data) {
    delete data.id; // TODO remove id at availableNodes prep

    this.getModel().addNode(
      new NodeModel({
        serial: this.diagram.nodeSerial++,
        ...data,
      }),
    );

    this.refreshDiagram();
  }

  goToInspector(id) {
    this.metadata.activeInspector.nodeId = id;
    this.metadata.page = 'Inspector';
  }

  importDemo(name) {
    // Naive implementation assuming all nodes are added in simple left to right configuration
    const demo = demos.find((demo) => demo.name == name);
    demo.diagram.history.forEach((headlessNode) => {
      this.addNode(headlessNode.serialize());
    });
  }

  nodesWithInspectables() {
    // React diagram is not observable outside of its own context
    // Reference the refresh counter to ensure we have the latest data
    this.diagram.refresh;

    // Get all nodes with features
    const nodes = this.getModel().getNodes() as NodeModel[];

    return nodes.filter((node) => node.isInspectable());
  }

  openNodeModal(nodeId: string): void {
    this.metadata.requestOpenNodeModal = nodeId;
    this.refreshDiagram();
  }

  resetOpenNodeModalRequest(): void {
    this.metadata.requestOpenNodeModal = null;
  }

  refreshDiagram() {
    this.diagram.refresh++;
  }

  increaseNodeSerial() {
    this.diagram.nodeSerial++;
  }

  setActiveStory(story) {
    this.metadata.activeStory = story;
  }

  setActiveInspector(nodeId) {
    this.metadata.activeInspector.nodeId = nodeId;
  }

  setActiveInspectorMode(mode: InspectorMode) {
    this.metadata.activeInspector.mode = mode;
  }

  setAvailableNodes(nodes) {
    this.diagram.availableNodes = nodes;
  }

  setEngine(engine) {
    this.diagram.engine = engine;
  }

  setPage(name) {
    const alreadyOnPage = this.metadata.page == name;
    this.metadata.page = alreadyOnPage ? 'Workbench' : name;
  }

  setResults(results) {
    this.results = results;
  }

  setNotRunning() {
    setTimeout(() => {
      this.metadata.running = false;
    }, 500);
  }

  clearResults() {
    const model =
      this.diagram.engine.getModel() as DiagramModel;

    model.clearNodeFeatures();
    model.clearLinkLabels();

    this.refreshDiagram();
  }

  setRunning() {
    this.metadata.running = true;
  }

  setStories(stories) {
    this.metadata.stories = stories;
  }

  showRunFail(error) {
    showNotification({
      message: 'Crap! Could not run story! Check console.',
      type: 'error',
    });
  }

  showRunSuccessful() {
    showNotification({
      message: 'Successfully ran story!',
      type: 'success',
    });
  }

  navigateDiagram(direction: {
    x: number;
    y: number;
  }): void {
    const selection = this.getModel().getSelectedEntities();

    if (
      selection.length !== 1 ||
      !(selection[0] instanceof NodeModel)
    )
      return;

    const current = selection[0];
    const currentPosition = current.getPosition();

    const getOffset = (n1: NodeModel, n2: NodeModel) => {
      return {
        x: n1.getPosition().x - n2.getPosition().x,
        y: n1.getPosition().y - n2.getPosition().y,
      };
    };

    const nodes = this.getModel().getNodes() as NodeModel[];

    const candidates = nodes.filter((candidate) => {
      // self is not a candidate!
      if (candidate.options.id === current.options.id)
        return false;
      // must be in the correct direction
      const offset = getOffset(candidate, current);
      if (Math.sign(offset.x) !== Math.sign(direction.x))
        return false;
      return true;
    });

    const sorted = candidates.sort((n1, n2) => {
      const distanceN1 =
        (n1.getPosition().x - currentPosition.x) *
        direction.x;
      const distanceN2 =
        (n2.getPosition().x - currentPosition.x) *
        direction.x;

      if (distanceN1 > distanceN2) return 1;
      if (distanceN1 < distanceN2) return -1;
    });

    if (sorted.length) {
      this.getModel().clearSelection();
      sorted[0].setSelected(true);
    }
  }

  setDiagramLocked(locked: boolean) {
    this.getModel().setLocked(locked);

    const state = this.diagram.engine
      .getStateMachine()
      .getCurrentState();

    // Little problems with state types
    // @ts-ignore
    if (state.dragCanvas !== undefined) {
      //@ts-ignore
      state.dragCanvas.config.allowDrag = !locked;
    }
  }

  setConfirmRequired(required: boolean) {
    this.metadata.confirmationRequired = required;
  }

  getModel(): DiagramModel {
    return this.diagram.engine.getModel() as DiagramModel;
  }
}

export const RootStore = ((window as any).store =
  new Store());
