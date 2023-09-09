import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from './api/axios';

const USER_REGEX = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';
const NAME_REGEX=/^[A-z][A-z0-9-_]{1,23}$/;
const PHONE_REGEX=/^[0-9]{10,11}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [username,setUserName]=useState('');
    const [lastname,setLastName]=useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [matchPwd, setMatchPwd] = useState('');
    const [phone,setPhoneNumber]=useState('');
    

    const [validName, setValidName] = useState(false);
    const [validPwd, setValidPwd] = useState(false);
    const [validMatch, setValidMatch] = useState(false);
    const [ValidPhoneNumber,setValidPhoneNumber]=useState(false);
    const [success, setSuccess] = useState(false);
    const [validUser, setValidUserName] = useState(false);
    const [ValidLastName,setValidLastName]=useState(false);
    
    const [pwdFocus, setPwdFocus] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
    const [UserNameFocus,setUserNameFocus]=useState(false);
    const [LastNameFocus,setLastNameFocus]=useState(false);
    const [PhoneNumberFocus,setPhoneNumberFocus]=useState(false);
    
    useEffect(()=>{
        setValidPhoneNumber(PHONE_REGEX.test(phone));
    },[phone])
    useEffect(()=>{
        setValidLastName(NAME_REGEX.test(lastname));
    },[lastname])
    useEffect(()=>{
        setValidUserName(NAME_REGEX.test(username));
    },[username])
    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setPwd('');
            setMatchPwd('');
            setUserName('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 align="center">Signup</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="first-name">
                            First Name:
                            <FontAwesomeIcon icon={faCheck} className={validUser ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validUser || !username ? "hide" : "invalid"} />

                        </label>
                        <input
                            type="text"
                            id="first-name"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUserName(e.target.value)}
                            value={username}
                            required
                            aria-invalid={validUser ? "false" : "true"}
                            aria-describedby="first-name-note"
                            onFocus={() => setUserNameFocus(true)}
                            onBlur={() => setUserNameFocus(false)}
                        />
                        <p id="first-name-note" className={UserNameFocus && user && !validUser ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Enter atleast 1 character.<br />
                        </p>

                        <label htmlFor="last-name">
                            Last Name:
                            <FontAwesomeIcon icon={faCheck} className={ValidLastName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={ValidLastName || !lastname ? "hide" : "invalid"} />

                        </label>
                        <input
                            type="text"
                            id="last-name"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastname}
                            required
                            aria-invalid={ValidLastName ? "false" : "true"}
                            aria-describedby="last-name-note"
                            onFocus={() => setLastNameFocus(true)}
                            onBlur={() => setLastNameFocus(false)}
                        />
                        <p id="last-name-note" className={LastNameFocus && user && !ValidLastName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Enter atleast 1 character.<br />
                        </p>
                        
                        <label htmlFor="username">
                            Email id:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must be an Email id.<br />
                        </p>
                        <label htmlFor="phone-number">
                            Mobile Number:
                            <FontAwesomeIcon icon={faCheck} className={ValidPhoneNumber ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={ValidPhoneNumber || !phone ? "hide" : "invalid"} />

                        </label>
                        <input
                            type="text"
                            id="phone-number"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phone}
                            required
                            aria-invalid={ValidPhoneNumber ? "false" : "true"}
                            aria-describedby="phone-number-note"
                            onFocus={() => setPhoneNumberFocus(true)}
                            onBlur={() => setPhoneNumberFocus(false)}
                        />
                        <p id="phone-number-note" className={PhoneNumberFocus && user && !ValidPhoneNumber ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Enter correct mobile number<br />
                        </p>
                       


                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button disabled={!validName || !validPwd || !validMatch ? true : false}>Next</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="#">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register
