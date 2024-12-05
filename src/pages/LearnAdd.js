import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FiPlus, FiMinus } from "react-icons/fi";

const LearnAdd = () => {
    const { albumId } = useParams(); // URL에서 albumId 가져오기
    const { token } = useSelector((state) => state.user);
    const [albumName, setAlbumName] = useState('');
    const [sentences, setSentences] = useState([]);
    const [newSentence, setNewSentence] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAddSentence = async (e) => {
        e.preventDefault();
        if (!newSentence.trim()) {
            alert('문장을 입력해주세요!');
            return;
        }

        // API 호출로 문장 추가
        const addSentence = async () => {
            try {
                const response = await axios.post(
                    `https://yfwebapp-eff7epg4dvhrftdv.koreacentral-01.azurewebsites.net/api/albums/${albumId}/sentences`,
                    { koreanText: newSentence }, // 필요한 문장 데이터
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSentences((prev) => [...prev, response.data.sentence]); // 추가된 문장 업데이트
                setNewSentence(''); // 입력 필드 초기화
                alert('문장이 성공적으로 추가되었습니다!');
            } catch (err) {
                if (err.response?.status === 401) {
                    alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
                    navigate("/Sign");
                } else {
                    console.error('Error adding sentence:', err.message);
                    setError('문장 추가에 실패했습니다.');
                }
            }
        };
        addSentence();
    };

    if (error) return <p>{error}</p>;
    if (!token) {
        setError('로그인이 필요합니다.');
        return;
    }
    return (
        <div id="LearnAdd" className="container">
            <div className="main-content container learning">
                <h3 className="components-section-title ml-3">
                    문장추가하기
                </h3>
                <p className="header-subtitle">나에게 꼭 맞는 문장으로 학습하세요!</p>
                <form className="contact-form col-md-10 col-lg-8 m-auto">
                    <label>앨범 ID</label>
                    <div className="form-row">
                        <div className="form-group col-sm-12">
                            <input type="text" size="50" className="form-control" value={albumId} readOnly />
                        </div>
                    </div>
                    <label>문장을 입력해주세요.</label>
                    <div className="form-row">
                        <div className="form-group col-sm-12">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Sentence"
                                value={newSentence}
                                onChange={(e) => setNewSentence(e.target.value)}
                            />
                            <button className="form-control"
                                style={{ cursor: 'pointer' }}
                                onClick={handleAddSentence}>
                                추가하기 <FiPlus />
                            </button>

                        </div>
                    </div>
                </form>
                {/* 추가된 문장 리스트 */}
                {sentences.length > 0 && (
                    <div className="contact-form col-md-10 col-lg-8 m-auto">
                        <h4>추가된 문장</h4>
                        <ul>
                            {sentences.map((sentence, index) => (
                                <li key={index}>

                                    <button
                                        className='btn btn-outline-primary btn-sm rounded-circle mr-2'
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => { }} >
                                        <FiMinus />

                                    </button> {sentence.koreanText}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="contact-form col-md-10 col-lg-8 m-auto">
                    <button
                        onClick={() => navigate(`/MyLearning/${albumId}`)}
                        className="btn btn-primary">학습하기</button>
                </div>
            </div>
        </div>
    );
};

export default LearnAdd;