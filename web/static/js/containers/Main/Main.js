import React, { PropTypes } from "react"
import { Navigation } from "components"
import styles from "./Main.sass"

export default class MainContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <Navigation />
        <div className={styles.main}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
