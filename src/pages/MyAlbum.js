import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiPlay } from "react-icons/fi";
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';



const MyAlbum = () => {
    const [sentences, setSentences] = useState([]);
    const [albumName, setAlbumName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // 페이지 이동을 위한 hook
    const { token } = useSelector((state) => state.user);
    const { id } = useParams();
    const {albumId} = id;

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError('로그인이 필요합니다.');
            return () => {
                setTimeout(() => {
                    navigate("/Sign");
                }, 300); // 300ms 딜레이
            };
        }
        setLoading(true);
        // 앨범 이름 가져오기
        const fetchAlbumDetails = async () => {
            // **백엔드 엔드포인트 없이 앨범 이름을 직접 전달하기 위한 수정**
            try {
                const response = await axios.get(
                    `https://yfwebapp-eff7epg4dvhrftdv.koreacentral-01.azurewebsites.net/api/albums/my`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const album = response.data.albums.find((album) => album.id.toString() === albumId);
                if (album) {
                    setAlbumName(album.name);
                } else {
                    console.error('앨범 정보를 찾을 수 없습니다.');
                }
            } catch (error) {
                console.error('앨범 정보를 불러오지 못했습니다:', error);
            }
        };
        const fetchSentences = async () => {
            try {
                const response = await axios.get(
                    `https://yfwebapp-eff7epg4dvhrftdv.koreacentral-01.azurewebsites.net/api/albums/my/${albumId}/sentences`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const { sentences } = response.data;
                setSentences(sentences);
            } catch (error) {
                console.error('문장 데이터를 불러오지 못했습니다:', error);
                setError(error);
            }
            setLoading(false);
        };
        fetchSentences();
        fetchAlbumDetails(); // 앨범 이름 가져오는 함수 호출
    }, [token, albumId]);


    if (loading) return <Spinner />;
    if (error) return <p>에러 발생: {error}</p>;

    // 학습 시작 버튼 클릭 시 이동
    const handleStartLearning = () => {
        navigate(`/learning/${albumId}`, { state: { sentences, albumName } });
    };

    return (
        <div id="sentences" className="container">
            <div className="main-content container learning">
                <h1 className="header-title">
                    <br />
                    <span className="down">{albumName}</span>
                    <br></br>
                    <Link to={`/learning/${albumId}`} > </Link>
                    <button onClick={handleStartLearning} className='btn btn-primary'>학습 시작 <FiPlay /></button>
                </h1>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>한국어</th>
                            <th>영어</th>
                            <th className='mobilehidden'>한국어 오디오</th>
                            <th className='mobilehidden'>영어 오디오</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sentences.map(({ id, koreanText, englishText, koreanAudioUrl, englishAudioUrl }, index) => {
                            return (
                                <tr key={id}>
                                    <td> {index + 1}</td>
                                    <td> {koreanText} </td>
                                    <td> {englishText}</td>
                                    <td className='mobilehidden'>
                                        <audio controls>
                                            <source src={koreanAudioUrl} type="audio/wav" />
                                            브라우저가 오디오를 지원하지 않습니다.
                                        </audio>
                                    </td>
                                    <td className='mobilehidden'>
                                        <audio controls>
                                            <source src={englishAudioUrl} type="audio/wav" />
                                            브라우저가 오디오를 지원하지 않습니다.
                                        </audio>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default MyAlbum;