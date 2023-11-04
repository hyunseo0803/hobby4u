import "../../styles/ReadClass.css";
import ReadClassOptionLB from "../../component/AllReadOptionLB";
import { useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

export default function ALL_CLASS(props) {
	const {
		data,
		readAll,
		handleReadDetail,
		like_status,
		goodClick,
		isLoggedIn,
	} = props;

	function isImage(urlString) {
		const fileEx = urlString.split(".").pop().toLowerCase();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(fileEx);
	}

	useEffect(() => {
		readAll();
	}, []);

	return (
		<div className="row_center_wrap">
			{data.map((classItem, index) => {
				const firstimg = classItem.img.replace("/frontend/public/", "/");

				const handleImageClick = (e) => {
					e.stopPropagation();
					handleReadDetail(classItem.class_id);
				};

				const handleButtonClick = () => {
					handleReadDetail(classItem.class_id);
				};
				const isFree = classItem.money === "0";
				const isOnline = classItem.type === "online";

				const likeStatusItem = like_status
					? like_status.find((item) => item.class_id === classItem.class_id)
					: null;

				return (
					<div key={index} className="class_div_btn">
						<div className="firstimg_container">
							{isImage(classItem.img) ? (
								<img
									className="firstimg"
									src={firstimg}
									alt="gg"
									onClick={handleImageClick}
								/>
							) : (
								<video
									className="firstimg"
									src={firstimg}
									alt="gg"
									onClick={handleImageClick}
									controls
								/>
							)}
						</div>
						<div
							className="class_div_MO"
							style={{
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<ReadClassOptionLB isFree={isFree} isOnline={isOnline} />
							<div className="class_GCount">
								{isLoggedIn ? (
									<button
										className="like_btn"
										onClick={() => goodClick(classItem.class_id)}
									>
										{likeStatusItem ? (
											<AiFillHeart size={20} color="#EC3535" />
										) : (
											<AiOutlineHeart size={20} color="#EC3535" />
										)}
									</button>
								) : (
									<div className="like">좋아요</div>
								)}

								<div className="like_text">{classItem.goodCount}</div>
							</div>
						</div>
						<button
							value={classItem.class_id}
							onClick={handleButtonClick}
							className="class_title_btn"
						>
							{classItem.title}
						</button>
					</div>
				);
			})}
		</div>
	);
}
