import React, { PropTypes } from 'react'
import { noop, money } from 'utils'

export default class MoneyInput extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    reverseDisplay: PropTypes.bool,
  };

  static defaultProps = {
    value: 0,
    onChange: noop,
    reverseDisplay: false,
  };

  handleChange = () => {
    const { value } = this.refs.input

    this.props.onChange(money.parseString(value) * this.signMultiplier)
  };

  get signMultiplier() {
    return this.props.reverseDisplay ? -1 : 1
  }

  render() {
    const { onChange, value, ...others } = this.props

    return (
      <input
        type="text"
        ref="input"
        value={money.centsToString(Math.round(value) * this.signMultiplier)}
        onChange={this.handleChange}
        {...others} />
    )
  }
}
