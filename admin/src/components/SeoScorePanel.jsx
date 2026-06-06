import React, { useMemo } from 'react';

/**
 * SeoScorePanel – Hệ thống chấm điểm SEO real-time cho bài viết/dự án
 * Tương tự Yoast SEO trên WordPress
 * 
 * @param {Object} props
 * @param {string} props.title - Tiêu đề bài viết
 * @param {string} props.content - Nội dung HTML bài viết
 * @param {string} props.focusKeyword - Từ khóa SEO chính (tùy chọn)
 * @param {string} props.metaDescription - Mô tả SEO tùy chỉnh (tùy chọn)
 * @param {boolean} props.hasImage - Có ảnh bìa hay không
 * @param {'blog'|'project'} props.type - Loại nội dung
 */
const SeoScorePanel = ({ title = '', content = '', focusKeyword = '', metaDescription = '', hasImage = false, type = 'blog' }) => {

  // Hàm strip HTML lấy text thuần
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim();
  };

  // Tính toán tất cả các tiêu chí SEO
  const seoChecks = useMemo(() => {
    const cleanContent = stripHtml(content);
    const wordCount = cleanContent ? cleanContent.split(/\s+/).filter(w => w.length > 0).length : 0;
    const cleanTitle = title.trim();
    
    // Auto-generate meta description nếu không có custom
    const effectiveMetaDesc = metaDescription.trim() || cleanContent.substring(0, 155);
    
    // Kiểm tra heading structure trong content
    const hasH2 = /<h2[\s>]/i.test(content);
    const hasH3 = /<h3[\s>]/i.test(content);
    const headingCount = (content.match(/<h[2-4][\s>]/gi) || []).length;

    // Kiểm tra có link trong content
    const hasLinks = /<a\s/i.test(content);

    // Kiểm tra có ảnh trong content
    const hasContentImages = /<img\s/i.test(content);
    
    // Focus keyword checks
    const hasKeyword = focusKeyword.trim().length > 0;
    const keywordLower = focusKeyword.trim().toLowerCase();
    const titleHasKeyword = hasKeyword && cleanTitle.toLowerCase().includes(keywordLower);
    const contentHasKeyword = hasKeyword && cleanContent.toLowerCase().includes(keywordLower);
    const metaHasKeyword = hasKeyword && effectiveMetaDesc.toLowerCase().includes(keywordLower);

    // Keyword density (nếu có keyword)
    let keywordDensity = 0;
    if (hasKeyword && wordCount > 0) {
      const keywordRegex = new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = cleanContent.match(keywordRegex);
      keywordDensity = matches ? ((matches.length / wordCount) * 100) : 0;
    }

    const checks = [];
    
    // 1. TITLE LENGTH (max 15 điểm)
    const titleLen = cleanTitle.length;
    if (titleLen === 0) {
      checks.push({ id: 'title', label: 'Tiêu đề bài viết', status: 'bad', score: 0, max: 15, detail: 'Chưa có tiêu đề!' });
    } else if (titleLen < 20) {
      checks.push({ id: 'title', label: 'Tiêu đề bài viết', status: 'warn', score: 5, max: 15, detail: `Tiêu đề quá ngắn (${titleLen} ký tự). Nên từ 30-60 ký tự.` });
    } else if (titleLen >= 20 && titleLen < 30) {
      checks.push({ id: 'title', label: 'Tiêu đề bài viết', status: 'warn', score: 10, max: 15, detail: `Tiêu đề hơi ngắn (${titleLen} ký tự). Tốt nhất từ 30-60 ký tự.` });
    } else if (titleLen >= 30 && titleLen <= 60) {
      checks.push({ id: 'title', label: 'Tiêu đề bài viết', status: 'good', score: 15, max: 15, detail: `Độ dài tiêu đề tốt (${titleLen} ký tự). ✓` });
    } else {
      checks.push({ id: 'title', label: 'Tiêu đề bài viết', status: 'warn', score: 10, max: 15, detail: `Tiêu đề quá dài (${titleLen} ký tự). Nên dưới 60 ký tự.` });
    }

    // 2. META DESCRIPTION (max 10 điểm)
    const metaLen = effectiveMetaDesc.length;
    if (metaDescription.trim()) {
      if (metaLen >= 120 && metaLen <= 155) {
        checks.push({ id: 'meta', label: 'Mô tả SEO (Meta Description)', status: 'good', score: 10, max: 10, detail: `Mô tả SEO chuẩn (${metaLen} ký tự). ✓` });
      } else if (metaLen > 0 && metaLen < 120) {
        checks.push({ id: 'meta', label: 'Mô tả SEO (Meta Description)', status: 'warn', score: 6, max: 10, detail: `Mô tả hơi ngắn (${metaLen} ký tự). Tốt nhất 120-155.` });
      } else {
        checks.push({ id: 'meta', label: 'Mô tả SEO (Meta Description)', status: 'warn', score: 6, max: 10, detail: `Mô tả quá dài (${metaLen} ký tự). Nên dưới 155.` });
      }
    } else {
      checks.push({ id: 'meta', label: 'Mô tả SEO (Meta Description)', status: 'warn', score: 4, max: 10, detail: 'Chưa viết mô tả SEO riêng. Hệ thống sẽ tự lấy từ nội dung.' });
    }

    // 3. CONTENT LENGTH (max 20 điểm)
    if (type === 'blog') {
      if (wordCount === 0) {
        checks.push({ id: 'content', label: 'Độ dài nội dung', status: 'bad', score: 0, max: 20, detail: 'Chưa có nội dung!' });
      } else if (wordCount < 100) {
        checks.push({ id: 'content', label: 'Độ dài nội dung', status: 'bad', score: 4, max: 20, detail: `Nội dung quá ngắn (${wordCount} từ). Tối thiểu 300 từ.` });
      } else if (wordCount < 300) {
        checks.push({ id: 'content', label: 'Độ dài nội dung', status: 'warn', score: 10, max: 20, detail: `Nội dung ngắn (${wordCount} từ). Nên viết ít nhất 300 từ.` });
      } else if (wordCount < 600) {
        checks.push({ id: 'content', label: 'Độ dài nội dung', status: 'good', score: 16, max: 20, detail: `Độ dài nội dung khá tốt (${wordCount} từ). ✓` });
      } else {
        checks.push({ id: 'content', label: 'Độ dài nội dung', status: 'good', score: 20, max: 20, detail: `Nội dung dài và chi tiết (${wordCount} từ). Rất tốt cho SEO! ✓` });
      }
    } else {
      // Project: content tính từ sections, đánh giá nhẹ hơn
      if (wordCount === 0) {
        checks.push({ id: 'content', label: 'Độ dài nội dung', status: 'bad', score: 0, max: 20, detail: 'Chưa có nội dung bài viết cho dự án!' });
      } else if (wordCount < 50) {
        checks.push({ id: 'content', label: 'Độ dài nội dung', status: 'warn', score: 8, max: 20, detail: `Nội dung ngắn (${wordCount} từ). Nên viết ít nhất 100 từ.` });
      } else {
        checks.push({ id: 'content', label: 'Độ dài nội dung', status: 'good', score: 20, max: 20, detail: `Nội dung tốt (${wordCount} từ). ✓` });
      }
    }

    // 4. HEADING STRUCTURE (max 10 điểm)
    if (type === 'blog') {
      if (headingCount === 0) {
        checks.push({ id: 'headings', label: 'Cấu trúc tiêu đề (H2, H3)', status: 'bad', score: 0, max: 10, detail: 'Chưa có tiêu đề phụ (H2/H3) trong bài. Nên chia bài thành các mục.' });
      } else if (headingCount === 1) {
        checks.push({ id: 'headings', label: 'Cấu trúc tiêu đề (H2, H3)', status: 'warn', score: 6, max: 10, detail: `Có ${headingCount} tiêu đề phụ. Nên thêm 2-3 tiêu đề nữa.` });
      } else {
        checks.push({ id: 'headings', label: 'Cấu trúc tiêu đề (H2, H3)', status: 'good', score: 10, max: 10, detail: `Có ${headingCount} tiêu đề phụ. Cấu trúc tốt! ✓` });
      }
    } else {
      // Project: heading từ sections
      if (headingCount >= 1) {
        checks.push({ id: 'headings', label: 'Cấu trúc tiêu đề đoạn', status: 'good', score: 10, max: 10, detail: `Có ${headingCount} tiêu đề đoạn. ✓` });
      } else {
        checks.push({ id: 'headings', label: 'Cấu trúc tiêu đề đoạn', status: 'warn', score: 4, max: 10, detail: 'Nên thêm tiêu đề cho các đoạn nội dung.' });
      }
    }

    // 5. IMAGE (max 15 điểm)
    if (hasImage) {
      if (type === 'blog' && hasContentImages) {
        checks.push({ id: 'image', label: 'Hình ảnh', status: 'good', score: 15, max: 15, detail: 'Có ảnh bìa + ảnh trong bài viết. Rất tốt! ✓' });
      } else if (hasImage) {
        checks.push({ id: 'image', label: 'Hình ảnh', status: 'good', score: 12, max: 15, detail: 'Có ảnh bìa. Nên thêm ảnh minh họa trong nội dung.' });
      }
    } else {
      checks.push({ id: 'image', label: 'Hình ảnh', status: 'bad', score: 0, max: 15, detail: 'Chưa có ảnh bìa! Bài viết cần có ít nhất 1 ảnh.' });
    }

    // 6. INTERNAL LINKS (max 10 điểm)
    if (hasLinks) {
      checks.push({ id: 'links', label: 'Liên kết trong bài', status: 'good', score: 10, max: 10, detail: 'Có liên kết trong nội dung. ✓' });
    } else {
      checks.push({ id: 'links', label: 'Liên kết trong bài', status: 'warn', score: 3, max: 10, detail: 'Chưa có link nào. Thêm link nội bộ hoặc link tham khảo sẽ tốt cho SEO.' });
    }

    // 7. FOCUS KEYWORD (max 20 điểm)
    if (!hasKeyword) {
      checks.push({ id: 'keyword', label: 'Từ khóa SEO chính', status: 'warn', score: 5, max: 20, detail: 'Chưa đặt từ khóa SEO. Nên thêm để tối ưu tìm kiếm (tùy chọn).' });
    } else {
      let keywordScore = 4; // Base score for having a keyword
      let keywordDetails = [];
      
      if (titleHasKeyword) {
        keywordScore += 6;
        keywordDetails.push('✓ Có trong tiêu đề');
      } else {
        keywordDetails.push('✗ Chưa có trong tiêu đề');
      }
      
      if (contentHasKeyword) {
        keywordScore += 5;
        keywordDetails.push('✓ Có trong nội dung');
      } else {
        keywordDetails.push('✗ Chưa có trong nội dung');
      }

      if (metaHasKeyword) {
        keywordScore += 3;
        keywordDetails.push('✓ Có trong mô tả SEO');
      } else {
        keywordDetails.push('✗ Chưa có trong mô tả SEO');
      }

      if (keywordDensity > 0.5 && keywordDensity < 3) {
        keywordScore += 2;
        keywordDetails.push(`✓ Mật độ tốt (${keywordDensity.toFixed(1)}%)`);
      } else if (keywordDensity >= 3) {
        keywordDetails.push(`⚠ Mật độ quá cao (${keywordDensity.toFixed(1)}%), nên giảm`);
      }

      const keywordStatus = keywordScore >= 16 ? 'good' : keywordScore >= 10 ? 'warn' : 'bad';
      checks.push({ id: 'keyword', label: `Từ khóa SEO: "${focusKeyword}"`, status: keywordStatus, score: keywordScore, max: 20, detail: keywordDetails.join(' | ') });
    }

    return checks;
  }, [title, content, focusKeyword, metaDescription, hasImage, type]);

  // Tính tổng điểm
  const totalScore = seoChecks.reduce((sum, c) => sum + c.score, 0);
  const maxScore = seoChecks.reduce((sum, c) => sum + c.max, 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // Màu sắc theo điểm
  const getScoreColor = (pct) => {
    if (pct >= 80) return { ring: '#22c55e', bg: 'bg-green-50', text: 'text-green-700', label: 'Tốt' };
    if (pct >= 50) return { ring: '#f59e0b', bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Trung bình' };
    return { ring: '#ef4444', bg: 'bg-red-50', text: 'text-red-700', label: 'Cần cải thiện' };
  };

  const scoreStyle = getScoreColor(percentage);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const statusIcon = (status) => {
    switch (status) {
      case 'good': return <span className="text-green-500 text-lg">●</span>;
      case 'warn': return <span className="text-yellow-500 text-lg">●</span>;
      case 'bad': return <span className="text-red-500 text-lg">●</span>;
      default: return null;
    }
  };

  return (
    <div className={`${scoreStyle.bg} border border-gray-200 rounded-xl p-5`}>
      {/* Header: Vòng tròn điểm số */}
      <div className="flex items-center gap-5 mb-5 pb-4 border-b border-gray-200">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            <circle
              cx="50" cy="50" r="40"
              stroke={scoreStyle.ring}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-black ${scoreStyle.text}`}>{percentage}</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Điểm SEO</h3>
          <p className={`text-sm font-bold ${scoreStyle.text}`}>{scoreStyle.label}</p>
          <p className="text-xs text-gray-500 mt-1">{totalScore}/{maxScore} điểm ({seoChecks.filter(c => c.status === 'good').length}/{seoChecks.length} mục đạt)</p>
        </div>
      </div>

      {/* Checklist chi tiết */}
      <div className="space-y-3">
        {seoChecks.map((check) => (
          <div key={check.id} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
            <div className="mt-0.5 shrink-0">{statusIcon(check.status)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-gray-800 truncate">{check.label}</p>
                <span className={`text-xs font-bold shrink-0 ${check.status === 'good' ? 'text-green-600' : check.status === 'warn' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {check.score}/{check.max}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeoScorePanel;
