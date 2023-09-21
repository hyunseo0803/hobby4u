import "../styles/FilterbtnRead.css";

export default function FILTER_BTN(props) {
	const { addFilter, money, option, apply_ok } = props;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				margin: 10,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					backgroundColor: "yellow",
					padding: 10,
				}}
			>
				<div style={{ marginRight: 20 }}>
					<button
						name="money"
						value="fee"
						onClick={(e) => addFilter(e)}
						style={{
							backgroundColor: money === "fee" ? "pink" : "transparent",
						}}
					>
						유료
					</button>
				</div>
				<div style={{ marginRight: 20 }}>
					<button
						name="money"
						value="free"
						onClick={(e) => addFilter(e)}
						style={{
							backgroundColor: money === "free" ? "pink" : "transparent",
						}}
					>
						무료
					</button>
				</div>
				<div style={{ marginRight: 20 }}>
					<button
						name="option"
						value="offline"
						onClick={(e) => addFilter(e)}
						style={{
							backgroundColor: option === "offline" ? "pink" : "transparent",
						}}
					>
						오프라인
					</button>
				</div>
				<div>
					<button
						name="option"
						value="online"
						onClick={(e) => addFilter(e)}
						style={{
							backgroundColor: option === "online" ? "pink" : "transparent",
						}}
					>
						온라인
					</button>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					backgroundColor: "yellow",
					padding: 10,
				}}
			>
				<button
					value="apply"
					onClick={(e) => addFilter(e)}
					style={{
						backgroundColor: apply_ok ? "pink" : "transparent",
					}}
				>
					신청 가능한 클래스
				</button>
			</div>
		</div>
	);
}
