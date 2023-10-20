import "../styles/FilterbtnRead.css";

export default function FILTER_BTN(props) {
	const { addFilter, money, option } = props;

	return (
		<div
			className="filter_btn_flex_row"
			style={{
				height: 50,
				marginTop: 50,
				margin: 10,
			}}
		>
			<div style={{ marginRight: 20 }}>
				<button
					className={money === "fee" ? "btn_normal_click" : "btn_normal"}
					name="money"
					value="fee"
					onClick={(e) => addFilter(e)}
				>
					유료
				</button>
			</div>
			<div style={{ marginRight: 20 }}>
				<button
					className={money === "free" ? "btn_normal_click" : "btn_normal"}
					name="money"
					value="free"
					onClick={(e) => addFilter(e)}
				>
					무료
				</button>
			</div>
			<div style={{ marginRight: 20 }}>
				<button
					className={option === "offline" ? "btn_normal_click" : "btn_normal"}
					name="option"
					value="offline"
					onClick={(e) => addFilter(e)}
				>
					오프라인
				</button>
			</div>
			<div style={{ marginRight: 20 }}>
				<button
					className={option === "online" ? "btn_normal_click" : "btn_normal"}
					name="option"
					value="online"
					onClick={(e) => addFilter(e)}
				>
					온라인
				</button>
			</div>
			<div style={{ marginRight: 20 }}>
				<button
					className="btn_normal"
					value="reset"
					onClick={(e) => addFilter(e)}
				>
					초기화
				</button>
			</div>
		</div>
	);
}
