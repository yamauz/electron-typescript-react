import React from "react";

import { connect } from "react-redux";

import { ipcRenderer } from "electron";

import mainReducers from "./main-reducers.js";

import * as AppActions from "./actions.js";

import { LOAD_LOCAL_FILE, LOCAL_FILE_TEXT } from "./constants.js";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleLoadClick = this.handleLoadClick.bind(this);

    this.handleLocalText = this.handleLocalText.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(LOCAL_FILE_TEXT, this.handleLocalText);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(LOCAL_FILE_TEXT, this.handleLocalText);
  }

  handleLoadClick() {
    ipcRenderer.send(LOAD_LOCAL_FILE);
  }

  handleLocalText(event, data) {
    this.props.setFileText(data);
  }

  render() {
    let isLoaded = "File is not loaded.";

    if (this.props.fileText && this.props.fileText.length > 0) {
      isLoaded = "File is loaded.";
    }

    // return ({isLoaded}<Button>"Click to load file"</Button>{this.props.fileText});
    return <Button>Click to load File</Button>;
  }
}

function mapStateToProps(state) {
  return {
    fileText: state.fileText
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setFileText: t => {
      dispatch(AppActions.receiveFileText(t));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
