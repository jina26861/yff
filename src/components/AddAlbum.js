import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import Modal from "../components/Modal";
import { useSelector, useDispatch } from 'react-redux';
import { addAlbum } from '../albumSlice';
import { FiPlus } from "react-icons/fi";

const AddAlbum = () => {
    const { isLoggedIn, token } = useSelector((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    //const navigate = useNavigate(); // useNavigate 훅 사용
    const [albumName, setAlbumName] = useState('');
    //const [packageName, setPackageName] = useState('');
    //const { albums } = useSelector((state) => state.albums);
    const dispatch = useDispatch();
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const newAlbum = {
        name: albumName,
        isPublic: false,
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn || !albumName.trim()) {
            alert('로그인 후 앨범 이름을 입력하세요!');
            return;
        }

        try {
            const response = await fetch(
                "https://yfwebapp-eff7epg4dvhrftdv.koreacentral-01.azurewebsites.net/api/albums/create",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name: newAlbum.name }),
                })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "앨범 추가 실패");
            }

            const data = await response.json();

            // 상태에 새 앨범 추가
            dispatch(addAlbum(data.album));

            alert('앨범이 성공적으로 추가되었습니다!');
            setAlbumName(''); // 입력 필드 초기화
            closeModal(); // 모달 닫기
        } catch (err) {
            console.error("앨범 추가 오류:", err);
        }
    };
    return (
        <tr><td>
            <button className='form-control' onClick={openModal}>내 앨범 추가하기 <FiPlus /></button>
            <Modal isOpen={isModalOpen} closeModal={closeModal} content={
                <div>
                    <h2>앨범 선택</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="앨범명" value={albumName}
                            onChange={(e) => setAlbumName(e.target.value)} />
                        <button type="submit" className="btn btn-primary">
                            추가
                        </button>
                    </form>
                </div>
            } >
            </Modal>
        </td></tr>
    )

};

export default AddAlbum;