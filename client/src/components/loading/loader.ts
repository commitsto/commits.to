import styled from 'styled-components'

const Loader = styled.div`
  margin: 10vh auto;

  .loading__bar:nth-child(1),
  .loading__bar:nth-child(1) div {
    z-index: 1;
    animation-delay: 0.0833333333s;
  }

  .loading__bar:nth-child(2),
  .loading__bar:nth-child(2) div {
    z-index: 2;
    animation-delay: 0.1666666667s;
  }

  .loading__bar:nth-child(3),
  .loading__bar:nth-child(3) div {
    z-index: 3;
    animation-delay: 0.25s;
  }

  .loading__bar:nth-child(4),
  .loading__bar:nth-child(4) div {
    z-index: 4;
    animation-delay: 0.3333333333s;
  }

  .loading__bar:nth-child(5),
  .loading__bar:nth-child(5) div {
    z-index: 5;
    animation-delay: 0.4166666667s;
  }

  .loading__bar:nth-child(6),
  .loading__bar:nth-child(6) div {
    z-index: 6;
    animation-delay: 0.5s;
  }

  .loading__indicator {
    display: flex;
    width: 100%;
    perspective: 2200px;
    padding: 20px 60px;
    position: relative;
  }

  .loading__bar {
    width: 30px;
    height: 120px;
    position: relative;
    margin-right: 10px;
    transform-style: preserve-3d;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    animation: animCube;
    /* Safari and Chrome */
    animation-iteration-count: infinite;
  }

  .loading__bar div {
    position: absolute;
    display: block;
    width: 30px;
    height: 120px;
  }

  .loading__bar .center {
    width: 30px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3), inset 0 1px rgba(255, 255, 255, 0.05);
    animation: animCenter;
    animation-iteration-count: infinite;
  }

  .loading__bar .bottom {
    width: 30px;
    height: 10px;
    bottom: 0;
    transform: rotateX(90deg);
    transform-origin: center bottom;
    animation: animBottom;
    animation-iteration-count: infinite;
  }

  .loading__bar .left {
    left: 0;
    transform: rotateY(90deg);
    transform-origin: left center;
    animation: animSide;
    animation-iteration-count: infinite;
  }

  .loading__bar .right {
    right: 0;
    transform: rotateY(-90deg);
    transform-origin: right center;
    animation: animSide;
    animation-iteration-count: infinite;
  }

  .loading__bar .left,
  .loading__bar .center,
  .loading__bar .right,
  .loading__bar .bottom,
  .loading__bar {
    animation-duration: 1s;
    animation-timing-function: ease-in-out;
  }

  .left,
  .right {
    background-color: #2b2830;
    background-image: linear-gradient(top, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  }

  .center {
    background-color: #2b2830;
    background-image: linear-gradient(top, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
  }

  .bottom {
    background-color: #1f1d23;
    background-image: linear-gradient(bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  }

  @keyframes animCube {
    30% {
      transform: translateZ(120px) translatex(0) translateY(0) rotatex(3deg) rotatey(0deg) rotateZ(0deg);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5), 0 12px 20px 1px rgba(0, 0, 0, 0.5);
    }
    100% {
      transform: translateZ(0px) rotatez(0deg);
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.5), 0 0 0 0 rgba(0, 0, 0, 0);
    }
  }
  @keyframes animSide {
    30% {
      width: 100px;
      background-color: #1d1c1f;
    }
    95% {
      width: 10px;
    }
  }
  @keyframes animBottom {
    30% {
      height: 100px;
    }
    95% {
      height: 10px;
    }
  }
  @keyframes animCenter /* Safari and Chrome */ {
    20% {
      background-color: #6a6371;
      box-shadow: 0 0 3px rgba(255, 255, 255, 0.15), inset 0 1px rgba(255, 255, 255, 0.5);
    }
    65% {
      box-shadow: 0 0 3px rgba(255, 255, 255, 0), inset 0 1px rgba(255, 255, 255, 0.25);
    }
  }

`

export default Loader
