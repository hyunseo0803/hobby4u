import React, { useEffect, useState } from "react";
import "../../styles/CreateClass.css";
import { useNavigate } from "react-router-dom";
import { XCircleFillIcon } from "@primer/octicons-react";
import { IoMdDownload } from "react-icons/io";
import LoginRequired from "../../common/LoginRequired";
import Swal from "sweetalert2";
import { IoMdCloudUpload } from "react-icons/io";

function CreateClass(props) {
	const navigate = useNavigate();

	const [token, SetToken] = useState();
	const [isNext, setIsNext] = useState(false);

	const [imageSrc, setImageSrc] = useState(null);
	const [imagepreview, setImagepreview] = useState("");
	const [videopreview, setVideopreview] = useState("");

	const [isImage, setIsImage] = useState("");

	// 제목, 소개, 옵션 값 저장
	const [inputValues, setInputValues] = useState({
		title: "",
		info: "",
		option: "offline",
	});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			SetToken(true);
		} else {
			SetToken(false);
		}
	}, []);

	// 입력 값의 변경 이벤트를 처리하는 함수
	const handleInputChange = (event) => {
		// event의 target 속성에서 name과 value 추출
		const { name, value } = event.target;
		// 1. ..prevInputValues는 기존의 inputValues 객체 복사
		// 2. [name]:value는 코드에서 결정되는 name을 새로운 필드 이름으로 생성하고 해당 필드 값을 value로 설정
		setInputValues((prevInputValues) => ({
			...prevInputValues,
			[name]: value,
		}));
	};

	// 라디오 버튼의 선택 값이 변경되었을 때 호출하는 함수, event를 변수로 받음.
	const handleRadioChange = (event) => {
		// event.target에서 value 속성을 사용하여 선택된 라디오 버튼의 값을 가져옴.
		// 이 값을 const { value } = event.target; 구문을 사용하여 추출
		const { value } = event.target;
		// ...prevInputValues를 사용하여 기존의 inputValues 객체를 복사
		// option 속성을 업데이트된 값으로 설정
		setInputValues((prevInputValues) => ({
			...prevInputValues,
			option: value,
		}));
	};

	const handleRemoveImg = () => {
		Swal.fire({
			title: "정말로 삭제 하시겠습니까?",
			icon: "warning",

			showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
			confirmButtonColor: "#3085d6", // confrim 버튼 색깔 지정
			cancelButtonColor: "#d33", // cancel 버튼 색깔 지정
			confirmButtonText: "삭제", // confirm 버튼 텍스트 지정
			cancelButtonText: "취소", // cancel 버튼 텍스트 지정
		}).then((result) => {
			// 만약 Promise리턴을 받으면,
			if (result.isConfirmed) {
				// 만약 모달창에서 confirm 버튼을 눌렀다면

				setImageSrc(null);
				setImagepreview(null);
				setVideopreview(null);
			}
		});
	};

	function handlePageChange() {
		console.log(inputValues);
		navigate("/createClass/detail", {
			state: {
				title: inputValues.title,
				info: inputValues.info,
				option: inputValues.option,
				imageSrc: imageSrc,
				imagepreview: imagepreview,
				videopreview: videopreview,
			},
		});
	}

	useEffect(() => {
		if (
			inputValues.title &&
			inputValues.info &&
			inputValues.option &&
			imageSrc !== null
		) {
			setIsNext(true);
		} else if (
			inputValues.title ||
			inputValues.info ||
			inputValues.option ||
			imageSrc !== null
		) {
			setIsNext(false);
		}
	}, [imageSrc, inputValues.title, inputValues.info, inputValues.option]);

	const uploadfile = (e) => {
		const file = e;

		if (file) {
			const reader = new FileReader();

			reader.onload = () => {
				if (file.type.startsWith("image/")) {
					setImageSrc(file);
					setImagepreview(reader.result);
					console.log("이미지 미리보기 저장됨");
					setIsImage(true);
				} else if (file.type.startsWith("video/")) {
					setImageSrc(file); // 파일 선택 시 이전 이미지 정보도 초기화하지 않음
					setVideopreview(reader.result);
					console.log("동영상 미리보기 저장됨");
					setIsImage(false);
				}
			};

			reader.readAsDataURL(file);
		}
	};

	const handleDownload = () => {
		const filename = "HOBBY 4 유앤미 활동 계획서.docx";
		const fileUrl = `${process.env.PUBLIC_URL}/media/${filename}`;

		const a = document.createElement("a");
		a.href = fileUrl;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	return (
		<div className="wrap">
			{token ? (
				<>
					<div className="component_row_wrapper" style={{ marginTop: 10 }}>
						<div className="rL_wrapper">
							{imagepreview || videopreview ? (
								<>
									<div className="img_wrapper" style={{ border: "none" }}>
										{isImage ? (
											<img
												src={imagepreview}
												style={{
													objectFit: "contain",
													width: "100%",
													height: "100%",
												}}
												alt="preview-img"
											/>
										) : (
											<video
												src={videopreview}
												style={{
													objectFit: "contain",
													width: "100%",
													height: "100%",
												}}
												controls
											/>
										)}
										<button className="remove_icon" onClick={handleRemoveImg}>
											<XCircleFillIcon size={24} />
										</button>
									</div>
								</>
							) : (
								<>
									<label className="img_wrapper" style={{ border: "dashed" }}>
										<div>
											<IoMdCloudUpload size={150} />
											<div>Upload Image or Video</div>
										</div>
										<input
											accept="image/*,video/*"
											id="ex_file"
											type="file"
											style={{ display: "none" }}
											onChange={(e) => {
												uploadfile(e.target.files[0]);
											}}
										/>
									</label>
								</>
							)}
						</div>
						<div className="rL_wrapper">
							<div className="background_input">
								<input
									type="text"
									name="title"
									value={inputValues.title}
									onChange={handleInputChange}
									className="Input_"
									style={{ height: 30 }}
									placeholder="제목을 입력해 주세요 "
								></input>
								<textarea
									type="text"
									name="info"
									value={inputValues.info}
									onChange={handleInputChange}
									className="Input_"
									style={{ resize: "none", height: 180 }}
									placeholder="나만의 클래스를 간단히 소개해주세요"
									maxlength="165"
								></textarea>
							</div>
							<div>
								<label>
									<input
										type="radio"
										name="offline"
										value="offline"
										checked={inputValues.option === "offline"}
										onChange={handleRadioChange}
										className="radio_button"
									/>
									오프라인 클래스
								</label>
								<label>
									<input
										type="radio"
										name="online"
										value="online"
										checked={inputValues.option === "online"}
										onChange={handleRadioChange}
										className="radio_button"
									/>
									온라인 클래스
								</label>
							</div>
						</div>
					</div>
					<div>
						{inputValues.option === "offline" && (
							<div
								style={{
									width: "100%",
									// height: 100,
									// backgroundColor: "yellow",
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									textAlign: "center",
									marginTop: 30,
								}}
							>
								<div>
									오프라인 활동일 경우, 아래를 클릭하여 활동 계획서 양식을
									다운받아 주세요
								</div>
								<div>
									<button onClick={handleDownload} className="download_btn">
										<div style={{ marginRight: 10 }}>
											<IoMdDownload size={25} />
										</div>
										<div>오프라인용 Download</div>
									</button>
								</div>
							</div>
						)}
						<button
							className="next"
							style={
								isNext
									? { color: "white", backgroundColor: "rgb(237, 99, 99)" }
									: {
											color: "rgb(252, 247, 240)",
											backgroundColor: "rgb(235, 179, 179)",
									  }
							}
							onClick={handlePageChange}
							disabled={!isNext}
						>
							NEXT
						</button>
					</div>
				</>
			) : (
				<>
					<LoginRequired />
				</>
			)}
		</div>
	);
}
export default CreateClass;
