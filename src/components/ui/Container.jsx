export default function Container({ children, className = '', as: Tag = 'div', style }) {
  return (
    <Tag className={`mx-auto max-w-[1400px] px-6 md:px-10 ${className}`} style={style}>
      {children}
    </Tag>
  );
}
