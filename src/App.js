import React, { Component } from 'react';
import _ from 'lodash';

const styles = {
  button: {
    borderWidth: 2,
    borderStyle: 'solid',
    fontSize: '30px',
    width: '70px',
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderStyle: 'solid',
    fontSize: '30px',
    width: '50px',
    textAlign: 'center',
  },
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      timeSet: 50, // 0~60
      ticking: false,
      secLeft: 3000,
      secSet: 3000,
    };
    this.toggle = this.toggle.bind(this);
    this.counter = '';
  }

  componentDidMount() {
    this.computeDimension();
    window.onresize = this.computeDimension.bind(this);
  }

  computeDimension() {
    if (window) {
      const smaller = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
      this.setState({
        width: smaller,
        height: smaller,
      });
    }
  }

  stop(andThen) {
    if (!andThen) {
      andThen = () => {};
    }
    this.setState({
      ticking: false
    }, () => {
      clearInterval(this.counter);
      andThen();
    });
  }

  start(andThen) {
    if (!andThen) {
      andThen = () => {};
    }
    this.setState({
      ticking: true,
      secLeft: this.state.secSet,
    }, () => {
      this.counter = setInterval(() => {
        if (this.state.secLeft > 0) {
          this.setState({
            secLeft: this.state.secLeft - 1,
          });
        } else {
          this.reset(50);
        }
      }, 1000);
      andThen();
    });
  }

  reset(minute) {
    this.stop();
    if (minute > 60) minute = 60;
    if (minute < 0) minute = 0;
    this.setState({
      timeSet: minute,
      secSet: minute * 60,
      secLeft: minute * 60,
    });
  }

  toggle() {
    this.state.ticking ? this.stop() : this.start();
  }

  generateArc(cx, cy, r, startAngle, endAngle) {
    const large_arc_flag = +(startAngle >= 180);
    const sweep_flag = 1;
    startAngle = startAngle % 360 / 180 * Math.PI;
    endAngle = endAngle % 360 / 180 * Math.PI;
    let toReturn = `M ${cx} ${cy} L ${-Math.sin(startAngle) * r + cx} ${-Math.cos(startAngle) * r + cy} A ${r} ${r} 0 ${large_arc_flag} ${sweep_flag} ${-Math.sin(endAngle) * r + cx} ${-Math.cos(endAngle) * r + cy} L ${cx} ${cy} Z`;
    return toReturn;
  }

  render() {
    const width = this.state.width;
    const height = this.state.height;
    const r = this.state.width * 49 / 100;
    const borderWidth = 4;
    return (
      <div style={{width: width + 'px', height: this.state.height+ 'px'}}>
        <svg width={width} height={height} style={{marginLeft: 'auto', marginRight: 'auto'}}>
          <circle cx={width/2} cy={height/2} r={r} stroke="black" strokeWidth={borderWidth} fill="lightgray"/>
          <path d={this.generateArc(width/2, height/2, r - borderWidth, this.state.secLeft / 60 * 6, 0)} fill="red" />
          <g>
            {_.range(12).map((n) => 
              (<line stroke="black" key={60-n*5}strokeWidth={borderWidth} x1={this.state.width/2} x2={this.state.width/2} y1="0" y2={this.state.width/50} transform={`rotate(${n*30},${this.state.width/2},${this.state.width/2})`}/>))
            }
          </g>
        </svg>
        <div style={{
          position: 'absolute',
          top: width/3 * 2,
          left: height/2 - (parseInt(styles.input.width) + parseInt(styles.button.width))/2,
        }}>
          <input
            style={styles.input}
            type="text"
            value={this.state.timeSet}
            onChange={(event) => this.reset(event.target.value)}/>
          <button
            type="button"
            onClick={() => this.toggle()}
            style={styles.button}
          >
            {this.state.ticking ? 'stop' : 'start'}  
          </button>
        </div>
      </div>
    );
  }
}
