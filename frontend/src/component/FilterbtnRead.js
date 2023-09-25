import "../styles/FilterbtnRead.css";

export default function FILTER_BTN(props) {
	const { addFilter, money, option, apply_ok } = props;

	return (
		<div
			className="flex_row"
			style={{
				justifyContent: "space-between",
				margin: 10,
			}}
		>
			<div
				className="flex_row"
				style={{
					padding: 10,
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
				<div>
					<button
						className={option === "online" ? "btn_normal_click" : "btn_normal"}
						name="option"
						value="online"
						onClick={(e) => addFilter(e)}
					>
						온라인
					</button>
				</div>
			</div>
			<div
				className="flex_row"
				style={{
					padding: 10,
				}}
			>
				<button
					className={apply_ok ? "btn_normal_click" : "btn_normal"}
					value="apply"
					onClick={(e) => addFilter(e)}
				>
					신청 가능한 클래스
				</button>
			</div>
		</div>
	);
}
