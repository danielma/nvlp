import React, { PropTypes } from "react"
import { observe } from "utils/react"
import { ListDesignation } from "components"
import DesignationApi from "api/designation"

function getObserves(props) {
  const designations = DesignationApi.query("index", { envelope_id: props.envelope.id })

  // include("transaction")

  return { designations }
}

class DesignationList extends React.Component {
  static propTypes = {
    // TODO: proptypes?
    designations: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  render() {
    const styles = require("./DesignationList.sass")

    return (
      <div>
        <div className={styles.header}>
          <span>Payee</span>
          <span className={styles.amount}>Amount</span>
        </div>
        {this.props.designations.map((designation) => (
          <ListDesignation
            designation={designation}
            key={designation.objectId} />
        ))}
      </div>
    )
  }
}

export default observe(getObserves)(DesignationList)
