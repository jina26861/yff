import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FiPlay } from "react-icons/fi";
import { useSelector } from 'react-redux';
import AddAlbum from '../components/AddAlbum';
import Spinner from '../components/Spinner';
//public



const Mypage = () => {
    const { userInfo, token } = useSelector((state) => state.user);
    const [packages, setPackages] = useState([]); // 앨범 데이터를 저장하는 상태
    const [sentences, setSentences] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [activeAccordion, setActiveAccordion] = useState(null); // 아코디언 상태

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError('로그인이 필요합니다.');
            navigate("/Sign");
            return;
        }
        // API 호출
        const fetchPackages = async () => {
            setLoading(true);
            try {
                const response1 = await axios.get(
                    'https://yfwebapp-eff7epg4dvhrftdv.koreacentral-01.azurewebsites.net/api/albums/my',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPackages(response1.data.albums);

                const sentencePromises = response1.data.albums.map(async ({ id, name }) => {
                    const response2 = await axios.get(
                        `https://yfwebapp-eff7epg4dvhrftdv.koreacentral-01.azurewebsites.net/api/albums/${id}/sentences`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    return { id, name, sentences: response2.data.sentences };
                })
                const sentenceResults = await Promise.all(sentencePromises);
                setSentences(sentenceResults);
                console.log(sentences);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();

    }, [token, navigate]);

    const toggleAccordion = (id) => {
        setActiveAccordion((prev) => (prev === id ? null : id)); // 클릭 시 열고 닫기
    };

    if (loading) return <Spinner />;
    if (error) return <p>에러 발생: {error}</p>;


    return (
        <div id="mypage" className="container">
            <div className="main-content container learning">
                <h3 className="components-section-title ml-3"> {userInfo?.name || '사용자'}님의 Album
                </h3>
                <p className="header-subtitle">Total : {sentences.length}</p>
                <table className="table table-striped">
                    <tbody>
                        {
                            sentences.map(({ name, id, sentences }) => (
                                <tr key={id}>
                                    <td
                                        className="accordion-header"
                                        onClick={() => toggleAccordion(id)}
                                        style={{
                                            cursor: 'pointer',
                                            color: activeAccordion === id ? 'blue' : 'black',
                                        }}
                                    >
                                        <FiPlay />
                                        {name}
                                        ({sentences.length})


                                        {/* 아코디언 내용 */}
                                        {activeAccordion === id && (
                                            <div className="accordion-content">
                                                <table className="table">
                                                    <tbody>
                                                        {sentences.map(
                                                            ({ id, koreanText, englishText, koreanAudioUrl, englishAudioUrl }, index) => (
                                                                <tr key={id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{koreanText}
                                                                        <audio className='mobilehidden' controls>
                                                                            <source src={koreanAudioUrl} type="audio/wav" />
                                                                            브라우저가 오디오를 지원하지 않습니다.
                                                                        </audio>
                                                                    </td>
                                                                    <td>{englishText}
                                                                        <audio className='mobilehidden' controls>
                                                                            <source src={englishAudioUrl} type="audio/wav" />
                                                                            브라우저가 오디오를 지원하지 않습니다.
                                                                        </audio>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                        <tr>
                                                            <td colSpan="3">
                                                                <button
                                                                    onClick={() => navigate(`/LearnAdd/${id}`)}
                                                                    className="btn btn-primary mr-2">문장추가하기</button>
                                                                <button
                                                                    onClick={() => navigate(`/MyLearning/${id}`, { state: { sentences, name } })}
                                                                    className="btn btn-primary">학습하기</button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        }
                        <AddAlbum />
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Mypage;