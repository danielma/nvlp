import React, { PropTypes } from 'react'
import ParseReact from 'parse-react'
import { Main, Login } from 'containers'
import { observe } from 'utils/react'

class App extends React.Component {
  static propTypes = {
    children: PropTypes.node,

    // connect
    user: PropTypes.object.isRequired,
  };

  render() {
    const styles = require('./App.sass')

    return (
      <div className={styles.wrapper}>
        {this.props.user ? <Main>{this.props.children}</Main> : <Login />}
      </div>
    )
  }
}

export default observe({ user: ParseReact.currentUser })(App)
