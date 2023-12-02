import "../../styles/ReadClass.css";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ReadClassOptionLB from "../../component/AllReadOptionLB";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function NEW_CLASS(props) {
	const {
		newdata,
		readFirebasefile,
		like_status,
		goodClick,
		isLoggedIn,
		userData,
	} = props;
	useEffect(() => {
		readMyClassid();
	}, []);
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 3;
	const totalPage = Math.ceil(newdata.length / itemsPerPage);
	const [myclassid, setMyclassid] = useState([]);

	const navigate = useNavigate();

	async function handleReadDetail(value) {
		try {
			const response = await axios.get(
				`http://localhost:8000/api/post/read_some_data/?class_id=${value}`
			);
			const classdetail = response.data.class_data;
			const daydetail = response.data.day_data;
			const updatedClassDetail = { ...classdetail };
			const classImg = await readFirebasefile("classFile", classdetail.img);
			if (classdetail.file) {
				const classfile = await readFirebasefile("file", classdetail["file"]);
				updatedClassDetail.file = classfile;
			}
			if (classdetail["infoimg1"]) {
				const intro1 = await readFirebasefile("intro", classdetail["infoimg1"]);
				updatedClassDetail.infoimg1 = intro1;
			}
			if (classdetail["infoimg2"]) {
				const intro2 = await readFirebasefile("intro", classdetail["infoimg2"]);
				updatedClassDetail.infoimg2 = intro2;
			}
			if (classdetail["infoimg3"]) {
				const intro3 = await readFirebasefile("intro", classdetail["infoimg3"]);
				updatedClassDetail.infoimg3 = intro3;
			}

			updatedClassDetail.img = classImg;

			const updatedDayDetail = await Promise.all(
				daydetail.map(async (day) => {
					const updatedDay = { ...day };
					try {
						updatedDay.day_file = await readFirebasefile("day", day.day_file);
					} catch (error) {
						console.error("Error getting file URL: ", error);
					}
					return updatedDay;
				})
			);
			navigate("/readClass/classDetail", {
				state: {
					ClassDetail: updatedClassDetail,
					DayDetail: updatedDayDetail,
					userData: userData,
				},
			});
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}

	const paginateData = () => {
		const startIndex = currentPage * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return newdata.slice(startIndex, endIndex);
	};

	const nextSlide = useCallback(() => {
		setCurrentPage((prevPage) => (prevPage + 1) % totalPage);
	}, [totalPage]);

	const prevSlide = useCallback(() => {
		setCurrentPage((prevPage) => (prevPage - 1 + totalPage) % totalPage);
	}, [totalPage]);

	useEffect(() => {
		const timer = setInterval(nextSlide, 5000);
		return () => {
			clearInterval(timer);
		};
	}, [nextSlide]);

	async function readMyClassid() {
		const jwt_token = localStorage.getItem("token");
		try {
			const response = await axios.get(
				`http://localhost:8000/api/post/read_my_class/`,
				{
					headers: {
						Authorization: `Bearer ${jwt_token}`,
					},
				}
			);
			const myclassid = response.data.allclass_my;
			setMyclassid(myclassid);
		} catch (e) {
			console.error(e);
		}
	}
	function isImage(urlString) {
		const extension = urlString.split("?")[0].split(".").pop();

		const imageEx = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

		return imageEx.includes(extension);
	}

	return (
		<div className="row_center_wrap">
			<div className="test">
				<button className="border_transcolor" onClick={prevSlide}>
					<HiChevronLeft size={50} />
				</button>
			</div>
			{paginateData().map((newItem, index) => {
				const handleImageClick = (e) => {
					e.stopPropagation();
					handleReadDetail(newItem.class_id);
				};

				const handleButtonClick = () => {
					handleReadDetail(newItem.class_id);
				};
				const isFree = newItem.money === "0";
				const isOnline = newItem.type === "online";
				const likeStatusItem = like_status
					? like_status.find((item) => item.class_id === newItem.class_id)
					: null;
				const notMyClass =
					myclassid.length > 0
						? !myclassid.some((item) => item.class_id === newItem.class_id)
						: true;

				return (
					<div className="class_div_btn">
						<div className="firstimg_container">
							{isImage(newItem.img) ? (
								<img
									className="firstimg"
									src={newItem.img}
									alt="gg"
									width={100}
									onClick={handleImageClick}
								/>
							) : (
								<video
									className="firstimg"
									src={newItem.img}
									alt="gg"
									width={100}
									onClick={handleImageClick}
									controls
								/>
							)}
						</div>
						<div
							className="class_div_MO"
							style={{ justifyContent: "space-between", alignItems: "center" }}
						>
							<ReadClassOptionLB isFree={isFree} isOnline={isOnline} />
							<div className="class_GCount">
								{isLoggedIn && notMyClass ? (
									<button
										className="like_btn"
										onClick={() => goodClick(newItem.class_id)}
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

								<div className="like_text">{newItem.goodCount}</div>
							</div>
						</div>
						<button
							className="class_title_btn"
							key={index}
							value={newItem.class_id}
							onClick={handleButtonClick}
						>
							{newItem.title}
						</button>
					</div>
				);
			})}
			<div className="test">
				<button className="border_transcolor" onClick={nextSlide}>
					<HiChevronRight size={50} />
				</button>
			</div>
		</div>
	);
}
