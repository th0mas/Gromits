import useToken from "./token";

const useApi = (method, ...params) => {
  const [data, setData]           = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  const [token, setToken] = useToken()


}