import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuthValue } from "../../context/AuthContext";

import styles from "./EditPost.module.css";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";

const EditPost = () => {
    const { id } = useParams();
    const { document: post } = useFetchDocument("posts", id);

    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setBody(post.body);
            setImage(post.image);

            const textTags = post.tagsArray.join(", ");

            setTags(textTags);
        }
    }, [post]);

    const { user } = useAuthValue();

    const { updateDocument, response } = useUpdateDocument("posts");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // validade image URL
        try {
            new URL(image);
        } catch (error) {
            setFormError("A imagem precisa ser uma URL válida.");
        }

        // validade image URL

        // criar o array de tags
        const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

        // checar todos os valores
        if (!title || !image || !tags || !body) {
            setFormError("Por favor, preencha todos os campos.");
        }

        if (formError) return;

        const data = {
            title,
            image,
            body,
            tagsArray
        };

        updateDocument(id, data);

        // redirect to home page
        navigate("/dashboard");
    }

    return (
        <div className={styles.edit_post}>
            {post && (
                <>
                    <h2>Editando Post: {post.title}</h2>
                    <p>Altere os dados do post como desejar!</p>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <span>Título:</span>
                            <input type="text" name="title" required placeholder="Pense num bom título..." onChange={(e) => setTitle(e.target.value)} value={title} />
                        </label>
                        <label>
                            <span>URL da imagem:</span>
                            <input type="text" name="image" required placeholder="Insira uma imagem que representa o seu Post" onChange={(e) => setImage(e.target.value)} value={image} />
                        </label>
                        <p className={styles.preview_title}>Preview da imagem atual:</p>
                        {image !== "" ? (<img className={styles.preview_image} src={image} alt={post.title} />) : (<p>Nenhuma imagem para exibir</p>)}
                        <label>
                            <span>Conteúdo:</span>
                            <textarea name="body" required placeholder="Insira o conteúdo do Post" onChange={(e) => setBody(e.target.value)} value={body} />
                        </label>
                        <label>
                            <span>Tags:</span>
                            <input type="text" name="tags" required placeholder="Insira as tags separadas por vírgula" onChange={(e) => setTags(e.target.value)} value={tags} />
                        </label>
                        {!response.loading && <button className="btn">Editar</button>}
                        {response.loading && <button className="btn" disabled>Aguarde...</button>}
                        {response.error && <p className="error">{response.error}</p>}
                        {formError && <p className="error">{formError}</p>}
                    </form>
                </>
            )}
        </div>
    )
}

export default EditPost