import React from "react";
//수평 구분선 안의 글자 props
const HorizonLine = ({ text }) => {
	//props 글자의 기본 style
	const TextStyle = {
		background: "#fff",
		padding: "0 10px",
	};

	const DivStyle = {
		width: "100%",
		textAlign: "center",
		borderBottom: "1px solid #aaa",
		lineHeight: "0.1em",
		margin: "10px 0 20px",
	};
	return (
		<div style={DivStyle}>
			<span style={TextStyle}>{text}</span>
		</div>
	);
};

export default HorizonLine;
