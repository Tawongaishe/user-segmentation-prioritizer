import React, { useState } from 'react';
import './SegmentTable.css';
import { useEffect } from 'react';

export default function SegmentTable() {

  const [segments, setSegments] = useState([]);
  const [criteria, setCriteria] = useState(['TAM', 'Willingness to Pay']);
  const [bestSegment, setBestSegment] = useState(null);

  useEffect(() => {
    // Calculate the best segment whenever segments or criteria change
    calculateBestSegment();
  }, [segments, criteria]);

  const calculateScore = (values) => {
    return Object.values(values).reduce((total, value) => {
      const score = value === 'Low' ? 1 : value === 'Medium' ? 2 : 3;
      return total + score;
    }, 0);
  };

  const calculateBestSegment = () => {
    let highestScore = 0;
    let best = null;
    
    segments.forEach(segment => {
      const score = calculateScore(segment.values);
      if (score > highestScore) {
        highestScore = score;
        best = segment;
      }
    });

    setBestSegment(best);
  };

  const addSegment = () => {
    setSegments([...segments, { id: segments.length, name: '', values: {} }]);
  };

  const removeSegment = (id) => {
    setSegments(segments.filter(segment => segment.id !== id));
  };

  const updateSegmentName = (id, name) => {
    const newSegments = segments.map(segment =>
      segment.id === id ? { ...segment, name } : segment
    );
    setSegments(newSegments);
  };

  const updateSegmentValue = (segmentId, criterion, value) => {
    const newSegments = segments.map(segment =>
      segment.id === segmentId ? { ...segment, values: { ...segment.values, [criterion]: value } } : segment
    );
    setSegments(newSegments);
  };

  const addCriteria = () => {
    const newCriteria = prompt('Enter new criteria name:');
    if (newCriteria) {
      setCriteria([...criteria, newCriteria]);
    }
  };

  return (
    <div>
      <button onClick={addSegment}>Add Segment</button>
      <button onClick={addCriteria}>Add Criteria</button>
      <table>
        <thead>
          <tr>
            <th>Segment</th>
            {criteria.map(criterion => (
              <th key={criterion}>{criterion}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {segments.map(segment => (
            <tr key={segment.id}>
              <td>
                <input
                  type="text"
                  value={segment.name}
                  onChange={(e) => updateSegmentName(segment.id, e.target.value)}
                  placeholder="Segment Name"
                />
              </td>
              {criteria.map(criterion => (
                <td key={criterion}>
                  <select
                    value={segment.values[criterion] || 'low'}
                    onChange={(e) => updateSegmentValue(segment.id, criterion, e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </td>
              ))}
              <td>
                <button onClick={() => removeSegment(segment.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {bestSegment && (
        <div>
          Best Segment to Choose: {bestSegment.name} with a score of {calculateScore(bestSegment.values)}
        </div>
      )}
    </div>
  );
}
