import{n as e}from"./rolldown-runtime-DF2fYuay.js";import{f as t,l as n,r,t as i}from"./vendor-C7JdeLBg.js";import{t as a}from"./index.esm-DC9eLAgx.js";import{n as o,r as s,t as c}from"./cloudinary-EpZn9wyr.js";import{n as l,t as u}from"./slugify-D9412hLl.js";import{t as d}from"./Breadcrumb-C7nMpRqD.js";import{t as f}from"./dist-x9sVNW4h.js";var p=e(t(),1),m=i(),h=(e,t=155)=>{if(!e)return``;let n=e.replace(/<[^>]*>?/gm,``).replace(/&nbsp;/gi,` `).replace(/\s+/g,` `).trim();return n.substring(0,t)+(n.length>t?`...`:``)},g=e=>e?e.replace(/&amp;/g,`&`).replace(/&lt;/g,`<`).replace(/&gt;/g,`>`).replace(/&quot;/g,`"`).replace(/&#039;/g,`'`).replace(/&ldquo;/g,`“`).replace(/&rdquo;/g,`”`).replace(/&lsquo;/g,`‘`).replace(/&rsquo;/g,`’`).replace(/&nbsp;/g,` `):``,_=()=>{let{id:e}=n(),[t,i]=(0,p.useState)(null),[_,v]=(0,p.useState)([]),[y,b]=(0,p.useState)(!0),[x,S]=(0,p.useState)([]),[C,w]=(0,p.useState)(!0),[T,E]=(0,p.useState)(``),[D,O]=(0,p.useState)({name:``,phone:``,email:``,content:``}),[k,A]=(0,p.useState)(!1);(0,p.useEffect)(()=>{e&&((async()=>{b(!0);try{let t=await(await fetch(`https://truongthanhphatdn.vn/api/blogs`)).json();if(t.success){let n=t.blogs.find(t=>t._id===e||e.endsWith(t._id));n&&(n.date=new Date(n.createdAt).toLocaleDateString(`vi-VN`),n.content&&=n.content.replace(/&nbsp;/g,` `).replace(/\u00a0/g,` `).replace(/[\u200b\u200c\u200d\ufeff]/g,``).replace(/&shy;|\u00ad/g,``),i(n)),v(t.blogs.filter(e=>!n||e._id!==n._id).slice(0,5).map(e=>({...e,date:new Date(e.createdAt).toLocaleDateString(`vi-VN`)})))}}catch(e){console.error(`Lỗi:`,e)}finally{b(!1)}})(),window.scrollTo(0,0))},[e]),(0,p.useEffect)(()=>{if(t&&t.content){let e=0,n=[],r=t.content.replace(/&nbsp;/g,` `).replace(/\u00a0/g,` `).replace(/[\u200b\u200c\u200d\ufeff]/g,``).replace(/&shy;|\u00ad/g,``).replace(/<(h[23])(.*?)>(.*?)<\/\1>/gi,(t,r,i,a)=>{let o=`heading-${e++}`,s=g(a.replace(/<[^>]*>?/gm,``).replace(/&nbsp;/gi,` `).trim());return n.push({id:o,text:s,level:r.toLowerCase()}),`<${r} id="${o}"${i}>${a}</${r}>`}),i=new DOMParser().parseFromString(r,`text/html`);i.querySelectorAll(`img`).forEach(e=>{e.getAttribute(`loading`)||e.setAttribute(`loading`,`lazy`);let n=e.parentElement,r=n,i=null;if(n){(n.tagName===`P`||n.classList.contains(`ql-image-wrapper`))&&(r=n);let e=r.nextElementSibling;e&&e.tagName===`P`&&(i=e)}if(i){let n=i.textContent.trim();n?(e.setAttribute(`alt`,l(n)),i.classList.add(`blog-image-caption`),r.classList.add(`blog-image-container`)):e.setAttribute(`alt`,l(t.title))}else e.setAttribute(`alt`,l(t.title))});let a=i.body.innerHTML;E(a),S(n)}},[t]);let j=e=>{let t=document.getElementById(e);if(t){let e=t.getBoundingClientRect().top+window.scrollY+-100;window.scrollTo({top:e,behavior:`smooth`})}};return y?(0,m.jsx)(`div`,{className:`pt-24 md:pt-32 pb-16 min-h-screen flex justify-center items-center`,children:(0,m.jsx)(`p`,{className:`animate-pulse text-green-600 font-bold text-sm md:text-base`,children:`Đang tải bài viết...`})}):t?(0,m.jsxs)(`section`,{className:`pt-24 md:pt-32 pb-10 md:pb-20 bg-gray-50 min-h-screen relative`,children:[(0,m.jsxs)(a,{children:[(0,m.jsxs)(`title`,{children:[t.title,` | Trường Thành Phát`]}),(0,m.jsx)(`meta`,{name:`description`,content:t.metaDescription||h(t.content)}),(0,m.jsx)(`link`,{rel:`canonical`,href:`https://truongthanhphatdn.vn/tin-tuc/${u(t.title)}-${t._id}`}),(0,m.jsx)(`meta`,{property:`og:type`,content:`article`}),(0,m.jsx)(`meta`,{property:`og:title`,content:t.title}),(0,m.jsx)(`meta`,{property:`og:description`,content:h(t.content)}),(0,m.jsx)(`meta`,{property:`og:url`,content:`https://truongthanhphatdn.vn/tin-tuc/${u(t.title)}-${t._id}`}),t.imageUrl&&(0,m.jsx)(`meta`,{property:`og:image`,content:t.imageUrl}),(0,m.jsx)(`meta`,{name:`twitter:card`,content:`summary_large_image`}),(0,m.jsx)(`meta`,{name:`twitter:title`,content:t.title}),(0,m.jsx)(`meta`,{name:`twitter:description`,content:h(t.content)}),t.imageUrl&&(0,m.jsx)(`meta`,{name:`twitter:image`,content:t.imageUrl}),(0,m.jsx)(`script`,{type:`application/ld+json`,children:JSON.stringify({"@context":`https://schema.org`,"@type":`BlogPosting`,headline:t.title,image:[t.imageUrl],datePublished:t.createdAt,dateModified:t.updatedAt,author:[{"@type":`Person`,name:t.author||`TTP Architect`,url:`https://truongthanhphatdn.vn`}],publisher:{"@type":`Organization`,name:`Trường Thành Phát`,logo:{"@type":`ImageObject`,url:`https://res.cloudinary.com/dia0hytop/image/upload/v1776675604/z7731184451078_e2096bacf215f8b507086b7a6712faa3_bjzvxz.png`}},description:h(t.content)})})]}),(0,m.jsxs)(`div`,{className:`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8`,children:[(0,m.jsx)(d,{items:[{label:`Tin tức`,link:`/tin-tuc`},{label:t.title}]}),(0,m.jsxs)(`div`,{className:`flex flex-col lg:flex-row gap-6 md:gap-10`,children:[(0,m.jsxs)(`div`,{className:`w-full lg:w-2/3 xl:w-3/4 min-w-0 bg-white p-4 md:p-10 rounded-lg md:rounded-xl shadow-sm border border-gray-100`,children:[(0,m.jsxs)(`div`,{className:`mb-5 md:mb-8 border-b border-gray-100 pb-4 md:pb-6`,children:[(0,m.jsx)(`span`,{className:`inline-block bg-green-100 text-green-700 text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded-sm mb-3`,children:t.category}),(0,m.jsx)(`h1`,{className:`text-xl sm:text-2xl md:text-4xl font-bold text-black leading-tight mb-3 md:mb-4`,children:t.title}),(0,m.jsxs)(`div`,{className:`flex flex-wrap items-center text-xs md:text-sm text-gray-500 font-medium`,children:[(0,m.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,m.jsx)(`svg`,{className:`w-3.5 h-3.5 md:w-4 md:h-4`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,m.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:`2`,d:`M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z`})}),` `,t.date]}),(0,m.jsx)(`span`,{className:`mx-2 md:mx-3`,children:`•`}),(0,m.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,m.jsx)(`svg`,{className:`w-3.5 h-3.5 md:w-4 md:h-4`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,m.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:`2`,d:`M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z`})}),` `,t.author]})]})]}),(0,m.jsx)(`div`,{className:`w-full aspect-video rounded-md md:rounded-lg overflow-hidden mb-5 md:mb-8`,children:(0,m.jsx)(`img`,{src:s(t.imageUrl,1200),srcSet:o(t.imageUrl,[400,600,800,1200]),sizes:c(`article`),alt:t.title,className:`w-full h-full object-cover`,fetchpriority:`high`})}),x.length>0&&(0,m.jsxs)(`div`,{className:`mb-8 bg-gray-50 border border-gray-200 rounded-lg p-5`,children:[(0,m.jsxs)(`div`,{className:`flex justify-between items-center mb-3`,children:[(0,m.jsx)(`h3`,{className:`font-bold text-lg text-black uppercase`,children:`Nội dung chính`}),(0,m.jsxs)(`button`,{onClick:()=>w(!C),className:`text-sm font-bold text-green-600 hover:text-green-800`,children:[`[`,C?`Ẩn`:`Hiện`,`]`]})]}),C&&(0,m.jsx)(`ul`,{className:`space-y-2 text-gray-700`,children:x.map(e=>(0,m.jsxs)(`li`,{className:`cursor-pointer hover:text-green-600 transition-colors flex items-start gap-2 ${e.level===`h3`?`ml-6 text-sm`:`font-medium mt-3 text-base`}`,onClick:()=>j(e.id),children:[e.level===`h2`&&(0,m.jsx)(`span`,{className:`text-green-500 mt-1`,children:`▪`}),e.level===`h3`&&(0,m.jsx)(`span`,{className:`text-gray-400 mt-0.5`,children:`-`}),(0,m.jsx)(`span`,{className:`flex-1 leading-snug`,children:e.text})]},e.id))})]}),(0,m.jsx)(`div`,{className:`blog-content text-gray-700 text-sm md:text-lg leading-relaxed`,dangerouslySetInnerHTML:{__html:T||t?.content}}),(0,m.jsx)(`div`,{className:`mt-8 md:mt-10 pt-4 md:pt-6 border-t border-gray-100 flex items-center justify-between`,children:(0,m.jsx)(`span`,{className:`font-bold text-black text-sm md:text-base`,children:`Chia sẻ bài viết:`})}),(0,m.jsxs)(`div`,{className:`mt-10 bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm`,children:[(0,m.jsxs)(`div`,{className:`text-center mb-6`,children:[(0,m.jsx)(`h3`,{className:`text-lg md:text-xl font-bold uppercase tracking-widest text-black mb-2`,children:`Nhận tư vấn từ kiến trúc sư`}),(0,m.jsx)(`p`,{className:`text-xs md:text-sm text-gray-500`,children:`Bạn đang có ý tưởng cho ngôi nhà của mình? Hãy để lại thông tin để Trường Thành Phát hỗ trợ tư vấn hoàn toàn miễn phí.`})]}),(0,m.jsxs)(`form`,{onSubmit:async e=>{if(e.preventDefault(),k)return;A(!0);let n=f.loading(`Đang gửi thông tin...`),r={name:D.name,phone:D.phone,email:D.email,content:`[Từ bài viết: ${t?.title}]\n\n${D.content}`};try{(await(await fetch(`https://truongthanhphatdn.vn/api/contact`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(r)})).json()).success?(f.success(`Gửi thành công!Cảm ơn bạn đã quan tâm đến sản phẩm và dịch vụ của TTP Architect. Chúng tôi sẽ liên hệ lại sớm nhất.`,{id:n}),O({name:``,phone:``,email:``,content:``})):f.error(`Có lỗi xảy ra, vui lòng thử lại sau.`,{id:n})}catch(e){console.error(`Lỗi gửi liên hệ:`,e),f.error(`Lỗi kết nối đến máy chủ!`,{id:n})}finally{A(!1)}},className:`space-y-4`,children:[(0,m.jsxs)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 gap-4`,children:[(0,m.jsx)(`input`,{required:!0,type:`text`,placeholder:`Họ và tên *`,value:D.name,onChange:e=>O({...D,name:e.target.value}),className:`w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm`}),(0,m.jsx)(`input`,{required:!0,type:`tel`,placeholder:`Số điện thoại *`,value:D.phone,onChange:e=>O({...D,phone:e.target.value}),className:`w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm`})]}),(0,m.jsx)(`textarea`,{required:!0,rows:`3`,placeholder:`Ghi chú yêu cầu của bạn (Diện tích, phong cách, số tầng...)`,value:D.content,onChange:e=>O({...D,content:e.target.value}),className:`w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm resize-none`}),(0,m.jsx)(`button`,{type:`submit`,disabled:k,className:`w-full text-white font-bold uppercase tracking-widest py-3 rounded-md shadow-md transition-colors duration-300 text-sm ${k?`bg-gray-400 cursor-not-allowed`:`bg-green-600 hover:bg-black`}`,children:k?`Đang gửi yêu cầu...`:`Gửi yêu cầu tư vấn ngay`})]})]})]}),(0,m.jsx)(`div`,{className:`w-full lg:w-1/3 xl:w-1/4`,children:(0,m.jsxs)(`div`,{className:`bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-20 md:top-28`,children:[(0,m.jsx)(`div`,{className:`bg-[#1A1A1A] text-center py-3 md:py-4 border-b-2 border-green-500`,children:(0,m.jsx)(`h3`,{className:`text-white text-sm md:text-lg font-bold uppercase tracking-wider`,children:`Bài viết mới nhất`})}),(0,m.jsx)(`div`,{className:`p-3 md:p-5 flex flex-col gap-4 md:gap-6`,children:_.length===0?(0,m.jsx)(`p`,{className:`text-xs md:text-sm text-gray-500 italic text-center`,children:`Chưa có bài viết khác.`}):_.map(e=>(0,m.jsxs)(r,{to:`/tin-tuc/${u(e.title)}-${e._id}`,className:`group flex gap-3 md:gap-4 items-start border-b border-gray-50 pb-3 md:pb-0 md:border-none last:border-none`,children:[(0,m.jsx)(`div`,{className:`w-20 h-16 md:w-24 md:h-20 shrink-0 overflow-hidden rounded border border-gray-100`,children:(0,m.jsx)(`img`,{src:s(e.imageUrl,200),srcSet:o(e.imageUrl,[100,200]),sizes:c(`thumbnail`),alt:e.title,className:`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500`,loading:`lazy`})}),(0,m.jsxs)(`div`,{className:`flex-1`,children:[(0,m.jsx)(`h4`,{className:`text-xs md:text-sm font-bold text-gray-800 line-clamp-2 md:line-clamp-3 leading-snug group-hover:text-green-600 transition-colors mb-1`,children:e.title}),(0,m.jsx)(`span`,{className:`text-[10px] md:text-[11px] text-gray-400 italic`,children:e.date})]})]},e._id))})]})})]})]}),(0,m.jsx)(`style`,{dangerouslySetInnerHTML:{__html:`
        .blog-content { word-break: keep-all !important; overflow-wrap: break-word !important; word-wrap: break-word !important; }
        .blog-content * { word-break: keep-all !important; overflow-wrap: break-word !important; word-wrap: break-word !important; }
        
        .blog-content h1 { font-size: 2rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; color: #111827; line-height: 1.2; }
        .blog-content h2 { font-size: 1.5rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; color: #111827; line-height: 1.3; scroll-margin-top: 100px; }
        .blog-content h3 { font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1f2937; line-height: 1.4; scroll-margin-top: 100px; }
        .blog-content h4 { font-size: 1.125rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #374151; }
        .blog-content h5, .blog-content h6 { font-size: 1rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; color: #4b5563; }
        
        .blog-content p {
          text-align: justify !important;
          font-size: 1rem !important;
          margin-bottom: 1.5rem !important;
          color: #4b5563 !important;
          white-space: pre-line !important;
          line-height: 1.625 !important;
        }
        .blog-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .blog-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        .blog-content li { margin-bottom: 0.5rem; }
        
        .blog-content a { color: #16a34a; text-decoration: underline; }
        .blog-content strong { font-weight: 700; }
        .blog-content em { font-style: italic; }
        .blog-content u { text-decoration: underline; }
        .blog-content s { text-decoration: line-through; }
        
        .blog-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin-top: 1.5rem; margin-bottom: 0px; }
        
        /* Custom Image Wrapper - hỗ trợ căn lề trái/giữa/phải */
        .blog-content .ql-image-wrapper { display: block; clear: both; margin: 1.5rem 0 0 0; }
        .blog-content .ql-image-wrapper[data-align="center"] { text-align: center; }
        .blog-content .ql-image-wrapper[data-align="center"] img { display: block; margin-left: auto; margin-right: auto; }
        .blog-content .ql-image-wrapper[data-align="left"] { text-align: left; }
        .blog-content .ql-image-wrapper[data-align="left"] img { display: block; margin-left: 0; margin-right: auto; }
        .blog-content .ql-image-wrapper[data-align="right"] { text-align: right; }
        .blog-content .ql-image-wrapper[data-align="right"] img { display: block; margin-left: auto; margin-right: 0; }
        
        /* Legacy: ảnh trong thẻ p (bài viết cũ không có wrapper) */
        .blog-content p > img { display: block; margin-left: auto; margin-right: auto; }

        .blog-content iframe.ql-video { width: 100%; aspect-ratio: 16/9; border-radius: 0.5rem; margin: 1.5rem 0 0px 0 !important; border: none; }
        
        .blog-content .blog-image-container {
          margin-bottom: 0px !important;
        }
        .blog-content .blog-image-container img {
          margin-bottom: 0px !important;
          border-bottom-left-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
        }
        
        .blog-content .blog-image-caption {
          background-color: #f8f9fa !important;
          color: #6b7280 !important;
          font-style: italic !important;
          text-align: center !important;
          padding: 10px 16px !important;
          margin-top: 0px !important;
          margin-bottom: 1.5rem !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          border: 1px solid rgba(243, 244, 246, 0.6) !important;
          border-top: none !important;
          border-bottom-left-radius: 0.5rem !important;
          border-bottom-right-radius: 0.5rem !important;
          line-height: 1.5 !important;
        }
        
        .blog-content .ql-align-center { text-align: center !important; }
        .blog-content .ql-align-right { text-align: right !important; }
        .blog-content .ql-align-justify { text-align: justify !important; }


        .blog-content [style*="font-size: 12px"] { font-size: 12px !important; }
        .blog-content [style*="font-size: 14px"] { font-size: 14px !important; }
        .blog-content [style*="font-size: 16px"] { font-size: 16px !important; }
        .blog-content [style*="font-size: 18px"] { font-size: 18px !important; }
        .blog-content [style*="font-size: 20px"] { font-size: 20px !important; }
        .blog-content [style*="font-size: 24px"] { font-size: 24px !important; }
        .blog-content [style*="font-size: 28px"] { font-size: 28px !important; }
        .blog-content [style*="font-size: 32px"] { font-size: 32px !important; }
        
        @media (min-width: 768px) {
          .blog-content h1 { font-size: 2.25rem; }
          .blog-content h2 { font-size: 1.875rem; }
          .blog-content h3 { font-size: 1.5rem; }
        }
      `}})]}):(0,m.jsx)(`div`,{className:`pt-24 md:pt-32 pb-16 min-h-screen flex justify-center items-center`,children:(0,m.jsx)(`p`,{className:`text-red-500 font-bold text-lg md:text-xl`,children:`Không tìm thấy bài viết!`})})};export{_ as default};