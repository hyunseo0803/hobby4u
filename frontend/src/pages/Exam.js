import React, { useState } from "react";
import "../styles/Exam.css";

function Exam(props) {
	const [ing, setIng] = useState(true);
	const [end, setEnd] = useState(false);

	function ingView() {
		setIng(true);
		setEnd(false);
	}
	function endView() {
		setIng(false);
		setEnd(true);
	}

	return (
		<div className="wrap">
			<div className="timeline">
				<div className="timeline-text-wrapper">
					<button
						className={ing ? "selectedText" : "timeline-text"}
						onClick={ingView}
					>
						심사중
					</button>
					<button
						className={end ? "selectedText" : "timeline-text"}
						onClick={endView}
					>
						심사 완료
					</button>
				</div>
			</div>
		</div>
	);
}
export default Exam;
