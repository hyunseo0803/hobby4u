import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";

function JudgeResult(props) {
	const { getPList, getNpList, readFirebasefile, getPClass, getNpClass } =
		props;
	const navigate = useNavigate();
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);

	useEffect(() => {
		getNpClass();
		getPClass();
	}, []);

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
	const Pcolumns = [
		{
			title: "class_title",
			dataIndex: "class_title",
			key: "class_title",
			width: "30%",
			...getColumnSearchProps("class_title"),
		},
		{
			title: "admin",
			dataIndex: "admin",
			key: "admin",
			width: "27%",

			...getColumnSearchProps("admin"),
		},
		{
			title: "date",
			dataIndex: "date",
			key: "date",
			width: "22%",
			defaultSortOrder: "descend",
			sorter: (a, b) => moment(a.date) - moment(b.date),

			...getColumnSearchProps("date"),
		},
		{
			title: "Read",
			key: "Read",
			render: (text, record) => (
				<Space size="middle">
					<Button onClick={() => handleReadDetail(record.class_id)}>
						View
					</Button>
				</Space>
			),
		},
	];
	const NPcolumns = [
		{
			title: "class_title",
			dataIndex: "class_title",
			key: "class_title",
			width: "30%",
			...getColumnSearchProps("class_title"),
		},
		{
			title: "admin",
			dataIndex: "admin",
			key: "admin",
			width: "18%",

			...getColumnSearchProps("admin"),
		},
		{
			title: "coment",
			dataIndex: "coment",
			key: "coment",
			width: "38%",

			...getColumnSearchProps("coment"),
		},
		{
			title: "date",
			dataIndex: "date",
			key: "date",
			width: "25%",
			defaultSortOrder: "descend",
			sorter: (a, b) => moment(a.date) - moment(b.date),

			...getColumnSearchProps("date"),
		},
		{
			title: "Read",
			key: "Read",
			render: (text, record) => (
				<Space size="middle">
					<Button onClick={() => handleReadDetail(record.class_id)}>
						View
					</Button>
				</Space>
			),
		},
	];

	async function handleReadDetail(value) {
		try {
			const response = await axios.get(
				`http://localhost:8000/api/post/read_some_data/?class_id=${value}`
			);
			const classdetail = response.data.class_data;
			const daydetail = response.data.day_data;
			console.log(classdetail);

			const updatedClassDetail = { ...classdetail };

			const classImg = await readFirebasefile("classFile", classdetail.img);
			if (classdetail.file) {
				const classfile = await readFirebasefile("file", classdetail.file);
				updatedClassDetail.file = classfile;
			}
			if (classdetail["infoimg1"]) {
				const intro1 = await readFirebasefile("intro", classdetail.infoimg1);
				updatedClassDetail.infoimg1 = intro1;
			}
			if (classdetail["infoimg2"]) {
				const intro2 = await readFirebasefile("intro", classdetail.infoimg2);
				updatedClassDetail.infoimg2 = intro2;
			}
			if (classdetail["infoimg3"]) {
				const intro3 = await readFirebasefile("intro", classdetail.infoimg3);
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
			navigate("/manager/judge/classdetail", {
				state: {
					ClassDetail: updatedClassDetail,
					DayDetail: updatedDayDetail,
					status: "finish",
				},
			});
		} catch (error) {
			console.error("Error submitting data:", error);
		}
	}
	return (
		<div
			style={{
				backgroundColor: "#d3d3d3",
				width: "100%",
				display: "flex",
				justifyContent: "center",
				flexDirection: "row",
				alignItems: "center",
			}}
		>
			<div
				style={{
					width: "55%",
					height: 640,
					backgroundColor: "white",
					margin: 10,
					borderRadius: 10,
				}}
			>
				<Table
					columns={NPcolumns}
					dataSource={getNpList}
					pagination={false}
					style={{
						overflowX: "auto",
						marginBottom: 20,
						height: 640,
					}}
				/>
			</div>
			<div
				style={{
					width: "35%",
					height: 640,
					backgroundColor: "white",
					margin: 10,
					borderRadius: 10,
				}}
			>
				<Table
					columns={Pcolumns}
					dataSource={getPList}
					pagination={false}
					style={{
						overflowX: "auto",
						marginBottom: 20,
						height: 640,
					}}
				/>
			</div>
		</div>
	);
}

export default JudgeResult;
