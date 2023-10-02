import React from "react";

const Background = ({ children }) => {
	return <div style={style.background_overlay}>{children}</div>;
};

const style = {
	background_overlay: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		marginTop: 60,
		zIndex: 1,
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		// top: 0,
		position: "relative",
	},
};

export default Background;
