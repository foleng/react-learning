import React from './react';
import ReactDOM from './react-dom';
import './index.css';

const app = <div className='555' style={{ color: 'red', height: 100, width: 100 }}>
  666
  <span style={{ fontSize: '18px', color: 'green' }}>7777</span>
</div>

console.log("🚀 ~ file: index.js:126 ~ app", app);

function FunctionComponent(props) {
  return <div className="title" style={{ color: 'red' }}><span>{props.name}</span>{props.children}</div>;
}

class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0
    }
  }

  handleClick = () => {
    console.log('handleClick');
    debugger;
    this.setState({
      number: this.state.number + 1
    })
  }

  render() {
    return <div onClick={this.handleClick} className="title" style={{ color: 'red' }}><span>{this.props.name}{this.state.number}</span>{this.props.children}</div>;
  }
}
let element1 = <FunctionComponent name="hello">world</FunctionComponent>;
let element = <ClassComponent name="hello">world 10086</ClassComponent>;

ReactDOM.render(
  element,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
