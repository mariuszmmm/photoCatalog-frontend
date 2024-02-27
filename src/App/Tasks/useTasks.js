import { useEffect, useRef, useState } from "react";
import useFetch from "./useFetch";

const useTasks = (state, setState) => {
  const areaRef = useRef(null);
  const areaEditRef = useRef(null);

  const [newTask, setNewTask] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imageTarget, setImageTarget] = useState(null);

  const [editedTaskId, setEditedTaskId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [imageEditTarget, setImageEditTarget] = useState(null);

  const {
    getItemFromBackEnd,
    sendItemToBackEnd,
    updateItemInBackEnd,
    deleteItemFromBackEnd,
    deleteTaskImageFromBackEnd
  } = useFetch();

  const inputNewTaskHandler = ({ target }) => {
    setNewTask(target.value);
  };

  const createFormData = (file, content) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('content', content);
    return formData;
  }


  //convert to base64encoded (string)
  const convertToBase64 = (targetFile, set) => {
    const reader = new FileReader();
    reader.readAsDataURL(targetFile);
    reader.onload = () => {
      set(reader.result)
    };
    reader.onerror = error => {
      alert("error in convertToBase64: ", error)
    };
  };

  const handleFileChange = (event) => {
    const targetFile = event.target.files[0]
    setFile(targetFile);
    setImageTarget(event.target)
    convertToBase64(targetFile, setImage)
  };

  const handleEditFileChange = (event) => {
    const targetFile = event.target.files[0]
    setEditFile(targetFile);
    setImageEditTarget(event.target)
    convertToBase64(targetFile, setEditImage)
  };

  const handleAddNewTask = async (imageTarget) => {
    const formData = createFormData(file, newTask);

    try {
      const res = await sendItemToBackEnd(formData)
      setState({
        ...state,
        tasks: [...state.tasks, res.data],
        loading: false,
      });
      setEditedTaskId(null)
      setEditContent("");
      setEditFile(null);
      setEditImage(null);
      setImageEditTarget(null);

      if (imageTarget) imageTarget.value = null;
    } catch (err) {
      alert("error in handleAddNewTask: ", err)
    }
  };

  const handleSaveEditedTask = async (imageTarget, editedTaskId) => {
    const formData = createFormData(editFile, editContent)
    try {
      const res = await updateItemInBackEnd(formData, editedTaskId);

      const newTasks = state.tasks.map((task) => (
        task._id !== res.data._id ? task : res.data
      ));

      setState({
        ...state,
        tasks: newTasks,
        loading: false,
      });
      setEditedTaskId(null)
      setEditContent("");
      setEditFile(null);
      setEditImage(null);
      setImageEditTarget(null);

      if (imageTarget) imageTarget.value = null;
    } catch (err) {
      alert("error in handleSaveEditedTask: ", err)
    }
  };

  const addNewTask = (event) => {
    event.preventDefault();
    if (newTask.trim() === "") {
      setNewTask("");
      areaRef.current.focus();
      return
    }

    handleAddNewTask(imageTarget);

    setNewTask("");
    setFile(null);
    setImage(null);
    areaRef.current.focus();
  };

  const saveEditedTask = () => {
    if (editContent.trim() === "") {
      setEditContent("");
      areaEditRef.current.focus();
      return
    }
    handleSaveEditedTask(imageEditTarget, editedTaskId);

  };

  const deleteTask = async (id) => {
    try {
      await deleteItemFromBackEnd(id);
      const newTasks = state.tasks.filter((task) => task._id !== id);
      setState({
        ...state,
        tasks: newTasks,
        loading: false,
      });
    } catch (err) {
      alert("error in deleteTask: ", err)
    }
  };

  const deleteImage = async (id) => {
    try {
      await deleteTaskImageFromBackEnd(id)
      const newTasks = state.tasks.map((task) => (
        task._id === id ? { ...task, image: null } : task));

      setState({
        ...state,
        tasks: newTasks,
        loading: false,
      });
    } catch (err) {
      alert("error in deleteImage: ", err)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getItemFromBackEnd()
        setState({
          ...state,
          tasks: [...res.data],
          loading: false,
        })
      } catch (err) {
        alert("error in fetchData: ", err)
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  return {
    areaRef,
    areaEditRef,
    newTask,
    inputNewTaskHandler,
    addNewTask,
    deleteTask,
    handleFileChange,
    image,
    deleteImage,
    saveEditedTask,
    editedTaskId,
    editContent,
    editImage,
    setEditedTaskId,
    setEditContent,
    handleEditFileChange,
  };
};

export default useTasks;