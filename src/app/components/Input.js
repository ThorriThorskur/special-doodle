export default function Input({ type = "text", ...props }) {
    return <input type={type} {...props} />;
}