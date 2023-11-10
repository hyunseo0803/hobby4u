import "../../styles/ReadClass.css";
import ReadClassOptionLB from "../../component/AllReadOptionLB";
import { useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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
		const extension = urlString.split("?")[0].split(".").pop();
		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(extension);
	}

	useEffect(() => {
		readAll();
	}, []);

	return (
		<div className="row_center_wrap">
			{data.map((d, index) => {
				const handleImageClick = (e) => {
					e.stopPropagation();
					handleReadDetail(d.class_id);
				};

				const handleButtonClick = () => {
					handleReadDetail(d.class_id);
				};
				const isFree = d.money === "0";
				const isOnline = d.type === "online";

				const likeStatusItem = like_status
					? like_status.find((item) => item.class_id === d.class_id)
					: null;

				return (
					<div key={index} className="class_div_btn">
						<div className="firstimg_container">
							{isImage(d.img) ? (
								<img
									className="firstimg"
									src={d.img}
									alt="gg"
									onClick={handleImageClick}
								/>
							) : (
								<video
									className="firstimg"
									src={d.img}
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
										onClick={() => goodClick(d.class_id)}
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

								<div className="like_text">{d.goodCount}</div>
							</div>
						</div>
						<button
							value={d.class_id}
							onClick={handleButtonClick}
							className="class_title_btn"
						>
							{d.title}
						</button>
					</div>
				);
			})}
		</div>
	);
}
