import styled from "styled-components";



const Targetbox = styled.div`
  position: absolute;

  left: ${({ x }) => x + "px"};
  top: ${({ y }) => y + "px"};
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};

  border: 4px solid  #FF0000;
  background-color: transparent;
  z-index: 20;
   border-radius: 10%;

  &::before {
    content: "${({ classType, score }) => `${classType} ${score.toFixed(3)}%`}";
    color: #39FF14;
    font-weight: bold;
    font-size: 17px;
    position: absolute;
   
    top: -1.5em;
    left: -5px;
  }
`;

export  default Targetbox;