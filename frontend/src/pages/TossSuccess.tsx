import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import Result from "antd/lib/result";
import Button from "antd/lib/button";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import Spin from "antd/lib/spin";

export default function TossSuccess() {
	const [searchParams] = useSearchParams();
	const orderId = searchParams.get("orderId");
	const paymentKey = searchParams.get("paymentKey");
	const amount = searchParams.get("amount");
	const navigate = useNavigate();

	const handlePaymentApproval = async () => {
		try {
			console.log("결제 승인 요청 하러감");
			const response = await axios.post(
				"http://localhost:8000/api/post/process_payment/",
				{
					orderId: orderId,
					paymentKey: paymentKey,
					amount: amount,
				}
			);
			// 결제 승인이 성공한 경우의 처리
			console.log("Payment approval success:", response.data);
			const result = response.data;
			if (result) {
				const token = localStorage.getItem("token");
				const decodedClassid = result.orderId.split("_")[1];

				console.log("원래 클래스 아이디는 : " + decodedClassid);
				const response = await axios.post(
					"http://localhost:8000/api/post/apply_class/",
					{
						token: token,
						classid: decodedClassid,
					}
				);
				navigate("/complete/payment", {
					state: {
						payinfo: result,
					},
				});
			} else {
				console.log("결제 승인 건에 대한 정보가 없습니다.");
			}
		} catch (error) {
			// 결제 승인이 실패한 경우의 처리
			console.error("Payment approval failed:", error);
		}
	};

	return (
		<div
			style={{
				margin: 150,
				// width: "50%",
				// backgroundColor: "yellow",
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Result
				icon={<LoadingOutlined style={{ fontSize: 24 }} spin />}
				title="진행 중"
				subTitle="아직 결제 중입니다. 결제를 완료하셨다면 결제 완료 버튼을 눌러주세요!"
				extra={[
					<Button type="primary" key="console" onClick={handlePaymentApproval}>
						결제 완료
					</Button>,
				]}
			/>
		</div>
	);
}
