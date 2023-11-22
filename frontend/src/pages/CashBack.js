import React, { useEffect, useState, useRef } from "react";
import Highlighter from "react-highlight-words";
import { DownOutlined, SearchOutlined, UpOutlined } from "@ant-design/icons";

// import { Button, Space, Table } from "antd";
import Space from "antd/lib/space";
import Button from "antd/lib/button";
import Table from "antd/lib/table";

import Input from "antd/lib/input";
import axios from "axios";

function CashBack(props) {
	const { userData, getUserData } = props;

	const [cashBackList, SetCashBackList] = useState([]);
	const [cashDetail, setCashDetail] = useState(false);

	useEffect(() => {
		console.log(userData);
		getCashbackList();
	}, []);

	const getCashbackList = async () => {
		const jwt_token = localStorage.getItem("token");
		try {
			const response = await axios.get(
				"http://localhost:8000/api/user/get_cashback_list/",
				{
					headers: {
						Authorization: `Bearer ${jwt_token}`,
					},
				}
			);
			console.log(response.data.cashlist);
			SetCashBackList(response.data.cashlist);
		} catch (err) {
			console.error(err);
		}
	};

	const handlecashback = async () => {
		if (userData.receive_cash === 0) {
			alert("환급 받을 수 있는 금액이 0원 입니다. ");
		} else {
			try {
				const response = await axios.post(
					"http://localhost:8000/api/user/get_cash_button/",
					{ cashBackList },
					{
						headers: {
							"Content-Type": "application/json", // Content-Type 설정
						},
					}
				);
				if (response.status === 200) {
					alert("환급되었습니다.");
					getUserData();
					getCashbackList();
				}
			} catch (err) {
				console.error(err);
			}
		}
	};
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};
	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	};
	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div
				style={{
					padding: 8,
				}}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters)}
						size="small"
						style={{
							width: 90,
						}}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({
								closeDropdown: false,
							});
							setSearchText(selectedKeys[0]);
							setSearchedColumn(dataIndex);
						}}
					>
						Filter
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{
					color: filtered ? "#1677ff" : undefined,
				}}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{
						backgroundColor: "#fdfd96",
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			) : (
				text
			),
	});

	const columns = [
		{
			title: "클래스 명",
			dataIndex: "class_id",
			key: "class_id",
			width: "30%",

			...getColumnSearchProps("class_id"),
		},
		{
			title: "원금",
			dataIndex: "money",
			key: "money",
			width: "25%",

			...getColumnSearchProps("money"),
		},
		{
			title: "캐시백",
			dataIndex: "cashback",
			key: "cashback",
			width: "25%",

			...getColumnSearchProps("cashback"),
		},
		{
			title: "상태",
			dataIndex: "status",
			key: "status",
			width: "30%",

			...getColumnSearchProps("status"),
		},
	];
	return (
		<div
			style={{
				margin: 100,
				justifyContent: "center",
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					width: "60%",
					// backgroundColor: "yellow",
				}}
			>
				<div
					style={{
						margin: 100,
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<div>환급 가능 금액 </div>
					<div style={{ fontSize: 30 }}>총 {userData.receive_cash}원</div>
				</div>
				<div style={{ margin: 50 }}>
					<button
						style={{
							width: "100%",
							border: "1.5px solid royalblue",
							padding: 5,
							backgroundColor: "transparent",
							borderRadius: 10,
							color: "royalblue",
							fontSize: 17,
						}}
						onClick={handlecashback}
					>
						환급 받기
					</button>
				</div>
				<div
					style={{
						margin: 100,
						justifyContent: "flex-end",
						alignItems: "flex-end",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div>환급 받은 금액 </div>
					<div style={{ fontSize: 20 }}>총 {userData.get_cash}원</div>
				</div>

				<div style={{ textAlign: "right", marginRight: 10 }}>
					<button
						style={{
							border: "none",
							backgroundColor: "transparent",
							color: "royalblue",
						}}
						onClick={() => setCashDetail(!cashDetail)}
					>
						캐시백 상세 내역 {cashDetail ? <UpOutlined /> : <DownOutlined />}
					</button>
				</div>
				{cashDetail && (
					<div style={{ margin: 10 }}>
						<Table
							columns={columns}
							dataSource={cashBackList}
							pagination={false}
							style={{
								overflowX: "auto",
								marginBottom: 20,
								width: "100%",
								// height: 230,
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default CashBack;
