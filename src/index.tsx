import * as React from "react";
import * as ReactDOM from "react-dom";

const App = (): JSX.Element => {
  return <div id="container">hello!!</div>;
};

ReactDOM.render(<App />, document.getElementById("app") as HTMLElement);

export default App;
