import React, { PropTypes } from "react"
import { Main } from "containers"

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const styles = require("./App.sass")

    return (
      <div className={styles.wrapper}>
        <Main>{this.props.children}</Main>
      </div>
    )
  }
}
