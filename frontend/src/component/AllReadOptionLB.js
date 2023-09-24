import "../styles/ReadClass.css";

export default function ReadClassOptionLB(props) {
	const { isFree, isOnline } = props;
	return (
		<div className="class_div_MO">
			{isFree ? (
				<div className="class_MO" style={{ width: 50 }}>
					무료
				</div>
			) : (
				<div className="class_MO" style={{ width: 50 }}>
					유료
				</div>
			)}
			{isOnline ? (
				<div className="class_MO" style={{ width: 110 }}>
					온라인 수업
				</div>
			) : (
				<div className="class_MO" style={{ width: 125 }}>
					오프라인 수업
				</div>
			)}
		</div>
	);
}
