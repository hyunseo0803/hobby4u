//로고 클릭시 나오는 화면, 제일 첫번째 화면
import React from "react";
import Home from "../../src/assets/Home.png";
import "../styles/FirstMain.css";

function FirstMain(props) {
	return (
		<div className="Main_wrap">
			<img src={Home} alt="" className="homeImg" />
			<div className="home_text_left">
				<span>
					나<br></br>
				</span>
				<span>
					만<br></br>
				</span>
				<span>
					을<br></br>
				</span>
				<span>
					<br></br>
				</span>
				<span>
					위<br></br>
				</span>
				<span>
					한<br></br>
				</span>
			</div>
			<div className="home_text_right">
				<span>
					완<br></br>
				</span>
				<span>
					벽<br></br>
				</span>
				<span>
					한<br></br>
				</span>
				<span>
					<br></br>
				</span>
				<span>
					취<br></br>
				</span>
				<span>
					미<br></br>
				</span>
			</div>
		</div>
	);
}

export default FirstMain;
