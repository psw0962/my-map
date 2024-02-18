import styled from "styled-components";

const Button = ({
  margin,
  width,
  fontSize,
  border,
  padding,
  borderRadius,
  backgroundColor,
  color,
  onClick,
  children,
}) => {
  return (
    <ButtonComp
      margin={margin}
      width={width}
      fontSize={fontSize}
      border={border}
      borderRadius={borderRadius}
      padding={padding}
      backgroundColor={backgroundColor}
      color={color}
      onClick={onClick}
    >
      {children}
    </ButtonComp>
  );
};

const ButtonComp = styled.div`
  font-size: ${(props) => (props.fontSize ? props.fontSize : "1.6rem")};
  width: ${(props) => (props.width ? props.width : "fit-content")};
  margin: ${(props) => props.margin && props.margin};
  border: ${(props) => (props.border ? props.border : "1px solid #000")};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "10px"};
  padding: ${(props) => (props.padding ? props.padding : "1rem")};
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "#fff"};
  color: ${(props) => (props.color ? props.color : "#000")};
  cursor: pointer;
`;

export default Button;
