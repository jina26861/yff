import React, { useState, useEffect } from 'react';
import dataLevel from '../datas/dataLevel'; // 데이터 가져오기

const getLevelDescription = (level) => {
    const levelData = dataLevel.find((item) => item.level === level);
    return levelData ? levelData.description : "레벨 설명을 찾을 수 없습니다.";
};

const TestResult = ({ result }) => {
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (result?.level) {
            const desc = getLevelDescription(result.level);
            setDescription(desc);
        }
    }, [result]);

    if (!result) {
        return <p>결과를 불러오는 중...</p>;
    }

    return (
        <div className="container pt-5 mt-5 center">
            <h2>테스트 결과</h2>
            <p>당신의 레벨은 <strong>{result.level}</strong>입니다.</p>
            <p>총 점수: <strong>{result.total_score}</strong>점</p>
            <p>{description}</p>
            <button onClick={() => window.location.reload()}>다시 시작</button>
        </div>
    );
};

export default TestResult;
