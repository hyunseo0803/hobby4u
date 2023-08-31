import React, { useEffect, useState } from "react";
import "../styles/CreateClass.css";
import { useNavigate } from "react-router-dom";

function CreateClass(props) {
	const navigate = useNavigate();

	const [token, SetToken] = useState();

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
			// getUserData();
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

	function handlePageChange() {
		console.log(inputValues);
		navigate("/createClass/detail", {
			state: {
				title: inputValues.title,
				info: inputValues.info,
				option: inputValues.option,
				imageSrc: imageSrc,
			},
		});
	}

	const [imageSrc, setImageSrc] = useState(null);
	const [imagepreview, setImagepreview] = useState("");

	const uploadfile = (e) => {
		setImageSrc(e);
		const reader = new FileReader();
		reader.readAsDataURL(e);

		return new Promise((resolve) => {
			reader.onload = () => {
				setImagepreview(reader.result);
				resolve();
			};
		});
	};

	return (
		<div className="wrap">
			{token ? (
				<>
					<div className="component_wrapper">
						<div className="left_wrapper">
							<div> 썸네일 이미지 및 영상 업로드</div>

							<div className="img_wrapper">
								{imagepreview ? (
									<>
										<img
											src={imagepreview}
											style={{
												objectFit: "cover",
												width: "100%",
												height: "100%",
											}}
											alt="preview-img"
										/>
									</>
								) : (
									<>
										<img
											width="50"
											height="50"
											src="https://img.icons8.com/ios/50/image--v1.png"
											alt="--v1"
										/>
									</>
								)}
							</div>
						</div>
						<div className="right_wrapper">
							{" "}
							<input
								type="file"
								onChange={(e) => {
									uploadfile(e.target.files[0]);
								}}
							/>
							<input
								type="text"
								name="title"
								value={inputValues.title}
								onChange={handleInputChange}
								className="Input_title"
								placeholder="제목을 입력해 주세요 "
							></input>
							<input
								type="text"
								name="info"
								value={inputValues.info}
								onChange={handleInputChange}
								className="Input_info"
								placeholder="나만의 클래스를 간단히 소개해주세요"
							></input>
							<div>
								<label>
									<input
										type="radio"
										name="offline"
										value="offline"
										checked={inputValues.option === "offline"}
										onChange={handleRadioChange}
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
									/>
									온라인 클래스
								</label>
							</div>
							<div>
								<button onClick={handlePageChange}>NEXT</button>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<div>로그인 필요함</div>
				</>
			)}
		</div>
	);
}
export default CreateClass;
