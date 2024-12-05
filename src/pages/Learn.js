import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FiPlay, FiPlus } from "react-icons/fi";
import { AiTwotoneSmile } from "react-icons/ai";

import Modal from "../components/Modal";
import { useSelector } from 'react-redux';

const dataMessage = [
    "오늘도 영핏과 함께 달려요 💪",
    "그대야말로 영어에 진심인 사람",
    "목표를 향해 오늘도 한 걸음 더",
    "방문횟수가 늘수록 영어실력 점프업",
    "오늘도 가뿐하게 시작해봅시다",
    "꾸준함이 이뤄내는 기적을 맛보실 겁니다",
    "영어로 꿈을 펼쳐내는 날이 보입니다",
    "영어가 달아주는 꿈의 부스터를 장착하세요",
];


const UserFunc = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [packageName, setPackageName] = useState('');
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        if (!packageName) return;
        setTimeout(() => {
            navigate("/LearnAdd");
        }, 300); // 300ms 딜레이
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`앨범: ${packageName}`);

        closeModal();
    };
    if (user) {
        return (
            <tr><td>
                <button className='form-control' onClick={() => { navigate("/mypage") }}>내 앨범 추가하기 <FiPlus /></button>
                <Modal isOpen={isModalOpen} closeModal={closeModal} content={
                    <div>
                        <h2>앨범 선택</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="앨범" value={packageName}
                                onChange={(e) => setPackageName(e.target.value)} />
                        </form>
                    </div>
                } >
                </Modal>
            </td></tr>
        )
    }
}

const Message = () => {
    const [message, setMessage] = useState('');
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * dataMessage.length);
        setMessage(dataMessage[randomIndex]);
    }, []);
    return <p>{message}</p>;
}

const Learn = ({ name }) => {
    const { userInfo, token } = useSelector((state) => state.user);
    const [packages, setPackages] = useState([]); // 앨범 데이터를 저장하는 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 hook


    useEffect(() => {
        // API 호출
        const fetchPackages = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://yfwebapp-eff7epg4dvhrftdv.koreacentral-01.azurewebsites.net/api/albums/public');
                //console.log(response.data.albums);

                if (Array.isArray(response.data.albums)) {
                    console.log('array');
                    setPackages(response.data.albums);
                    console.log(packages);
                } else {
                    throw new Error("올바른 데이터 형식이 아닙니다.");
                }

            } catch (err) {
                setError(err.message);


            } finally {
                setLoading(false);
            }
        };
        fetchPackages();

    }, []);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러 발생: {error}</p>;
    if (!packages) return <p>데이터를 불러올 수 없습니다.</p>;

    return (
        <div id="learn" className="container">
            <div className="main-content container learning">
                <div className='greeting'>
                    <h2><AiTwotoneSmile /></h2>
                    <div className='greeting-text'>
                        Hi!,  {userInfo?.name || '사용자'}님  {userInfo?.visitCount || '1'}번째 방문이시네요!<br />
                        <Message /></div>
                </div>
                <h1 className="header-title">
                    <br />
                </h1>
                <h3 className="components-section-title ml-3">학습문장 앨범 리스트</h3>
                <hr />
                <table className="table table-striped">
                    <tbody>
                        {packages.map(({ id, name, sentences }) => {
                            return (
                                <tr key={id}>
                                    <td onClick={() => navigate(`/album/${id}`, { state: { sentences, name } })}> <FiPlay /> {name}</td>
                                </tr>
                            )
                        }
                        )}
                        <UserFunc user={userInfo?.name || ''} />
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Learn;