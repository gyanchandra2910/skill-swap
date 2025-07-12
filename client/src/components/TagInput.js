import React, { useState, useEffect } from 'react';

const TagInput = ({ value = [], onChange, placeholder = "Add tags" }) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState(value);

  useEffect(() => {
    setTags(value);
  }, [value]);

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onChange(newTags);
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChange(newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="tag-input-container">
      <div className="form-control d-flex flex-wrap align-items-center" style={{ minHeight: '38px', padding: '4px' }}>
        {tags.map((tag, index) => (
          <span
            key={index}
            className="badge bg-primary me-1 mb-1 d-flex align-items-center"
            style={{ fontSize: '0.875rem' }}
          >
            {tag}
            <button
              type="button"
              className="btn-close btn-close-white ms-1"
              style={{ fontSize: '0.5rem' }}
              onClick={() => removeTag(index)}
              aria-label="Remove tag"
            />
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          style={{
            border: 'none',
            outline: 'none',
            flexGrow: 1,
            minWidth: '100px',
            backgroundColor: 'transparent',
            margin: '2px'
          }}
        />
      </div>
      <div className="form-text">
        Press Enter or comma to add tags. Click × to remove.
      </div>
    </div>
  );
};

export default TagInput;
