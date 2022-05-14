import { useState, useEffect } from 'react';
import './App.css'
import Alert from "react-bootstrap/Alert";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  const [arr, setarr] = useState([]);
  const [data, setdata] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber1: "",
    phoneNumber2: "",
    phoneNumber3: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    qualification: "",
    comments: ""
  })
  const [incformat, setincformat] = useState({
    incemail: false,
    incphon: false,
    incount: false
  });
  const [message, setmessage] = useState('')
  const [proc, setproc] = useState('post')
  const [uniqid, setuniqid] = useState(0);
  const [disab, setdisab] = useState(false)
  let initstate = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber1: "",
    phoneNumber2: "",
    phoneNumber3: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    qualification: "",
    comments: ""
  }

  async function fetarr() {
    let res = await fetch('http://54.202.218.249:9501/api/users');
    let res2 = await res.json();
    if (res.status === 200)
      setarr([...res2]);
  }

  function addata(e) {

    setdata(p => {
      return ({
        ...p,
        [e.target.name]: e.target.value
      })
    })

  }
  
  let fetchData = {
    body: JSON.stringify({
      firstName: data['firstName'],
      lastName: data['lastName'],
      email: data['email'],
      phoneNumber: data['phoneNumber1'] + data['phoneNumber2'] + data['phoneNumber3'],
      address1: data['address1'],
      address2: data['address2'],
      city: data['city'],
      state: data['state'],
      zipCode: data['zipCode'],
      country: data['country'],
      qualification: data['qualification'],
      comments: data['comments']
    }),
    headers: { "Content-type": "application/json" }
  }

  async function subpost() {

    let res = await fetch('http://54.202.218.249:9501/api/users',{method:"POST", ...fetchData});
    if (res.status === 201){
    fetarr();
    setdata({...initstate})
    setmessage('200')
    }
    else
    setmessage('500')
    
  }

  async function updateresource(){
    let res = await fetch(`http://54.202.218.249:9501/api/users/${uniqid}`,{method:"PUT", ...fetchData});
    if (res.status === 200)
    fetarr();
   
  
  }



  function sub(e) {
   e.preventDefault()

    let count = 0;
    let email = /^[^\?\>\<\"\\\|\{\}\[\]]([a-zA-Z0-9\-\_\.]){0,60}\@gmail\.([a-zA-Z]){3,10}$/;
    let phn1 = /([0-9]){4}/
    let phn2 = /([0-9]{3})/

    for (let r in data) {
      if (data[r].length === 0)
        ++count;
    }
    //here it is checked that all fields are manadatory  and form is submitted 
    //if all the fields are in correct format and are filled properly


    //here checking all field are in correct format
    //if not which field is incorrect i.e. email && password

    if (phn1.test(data.phoneNumber1) && phn2.test(data.phoneNumber2)
      && phn2.test(data.phoneNumber3) && email.test(data.email)
      && count === 0) {
     
      setincformat(p => {
        return ({ incemail: false, incphon: false, incount: false })
      })
      if (proc === 'update')
      updateresource();

    else
     subpost();

    }


    else {
      
      //if all fields are not filled then primary error is
      // enter all fields if all fields 
      // then validation on email and phone is checked

      if (count !== 0){
        setincformat(p => {
          return ({ incemail: false, incphon: false, incount: true })
        })
      }

      else if ((!phn1.test(data.phoneNumber1) || !phn2.test(data.phoneNumber2)
        || !phn2.test(data.phoneNumber3)) && !email.test(data.email))
        setincformat(p => {
          return ({ incphon: true, incemail: true, incount: false })
        })

      else if ((!phn1.test(data.phoneNumber1) || !phn2.test(data.phoneNumber2)
        || !phn2.test(data.phoneNumber3)) && email.test(data.email))

        setincformat(p => {
          return ({ incemail: false, incphon: true, incount: false })
        })

      else if (!email.test(data.email) && (phn1.test(data.phoneNumber1) || phn2.test(data.phoneNumber2)
        || phn2.test(data.phoneNumber3)))
        setincformat(p => {
          return ({ incphon: false, incemail: true, incount: false })
        })

    }


  }
  function autofil(a){
   setdata({...a,phoneNumber1:a.phoneNumber.slice(0,4), phoneNumber2:a.phoneNumber.slice(4,7), phoneNumber3:a.phoneNumber.slice(7)})
   setproc('update')
   setuniqid(a._id)
   setdisab(false)
   setmessage('')
   
  }

  async function deleteresource(a){
    let res = await fetch(`http://54.202.218.249:9501/api/users/${a._id}`,{method:"DELETE"});
    if (res.status === 204)
    fetarr();
  }

  function viewdata(a){
    setdata({...a,phoneNumber1:a.phoneNumber.slice(0,4), phoneNumber2:a.phoneNumber.slice(4,7), phoneNumber3:a.phoneNumber.slice(7)})
    setdisab(true)
    setproc('view')
  }

  useEffect(() => {
    fetarr();
  }, [])

  return (
    <>
      <div className="container">
        <div className="register col-md-5 col-sm-6">
          <h1 className="title"><strong>Bio Data</strong>
          </h1>


          <form role="form" >
            <div className="form-group">
            {(proc === 'update') ? <Alert variant='primary'>You are in edit mode</Alert> : 
            (proc === 'view') ? <Alert variant='primary'>You are in view mode</Alert>:
            <Alert variant='primary'>Create new resource</Alert>}
              {(incformat.incount) ? <Alert variant='danger'>Enter all mandatory fields</Alert>:<></>}
              {(message === '500')?<Alert variant='danger'>Create with other email </Alert>:
              (message === '200')?<Alert variant='primary'>New Resource created </Alert>:<></>}

              <label className="reg_txt">Name <span>*</span></label>
              <div className="controls form-inline">
                <input type="text" maxLength={50} disabled={disab} onChange={addata} value={data.firstName} className="input-name" name='firstName' placeholder="First" />
                <input type="text" maxLength={50} disabled={disab} onChange={addata} value={data.lastName} className="input-name" name='lastName' placeholder="Last" />
              </div>
            </div>
            <div className="clearfix"></div>


            <div className="form-group">
              <label className="reg_txt">Email  <span>*</span></label>
              <input type="text"  disabled={disab} onChange={addata} value={data.email} name='email' className="form-register text" placeholder="E-mail" />
            </div>
            {(incformat.incemail) ? <Alert variant='danger'>Enter Email in correct format</Alert> : <></>}
            <div className="clearfix"></div>

            <div className="form-group" style={{ height: "70px" }}>
              <label className="reg_txt">Phone Number  <span>*</span></label>
              <div className="clearfix"></div>
              <div className="wsite-form">

                <input type="text" maxLength={4} disabled={disab} onChange={addata} value={data.phoneNumber1} name="phoneNumber1" className="text input-name1" />
              </div>

              <div className="line">-</div>
              <div className="wsite-form">
                <input type="text" maxLength={3} disabled={disab} onChange={addata} value={data.phoneNumber2} name="phoneNumber2" className="text input-name1" />
              </div>

              <div className="line">-</div>
              <div className="wsite-form">
                <input type="text" maxLength={3} disabled={disab} onChange={addata} value={data.phoneNumber3} name="phoneNumber3" className="text input-name1" />
              </div>

              {/* <Alert variant='danger'>phoneNumber not coorect</Alert> */}


            </div>
            {(incformat.incphon) ? <Alert variant='danger'>Enter Phone in correct format</Alert> : <></>}


            <div className="clearfix"></div>

            <div className="form-group">
              <label className="reg_txt">Address  <span>*</span></label>
              <input type="text" disabled={disab} onChange={addata} value={data.address1} name='address1' className="form-register text" id="" placeholder="Line 1" style={{ marginBottom: "15px" }} />
              <input type="text" disabled={disab} onChange={addata} value={data.address2} name='address2' className="form-register text" id="" placeholder="Line 2" />
            </div>

            <div className="form-group">
              <div className="controls form-inline">
                <input type="text" disabled={disab} onChange={addata}  value={data.city} name='city' className="input-name" placeholder="City" />
                <input type="text" disabled={disab} onChange={addata} value={data.state} name='state' className="input-name" placeholder="State" />
              </div>
            </div>

            <div className="form-group">
              <div className="controls form-inline">
                <input type="text" disabled={disab} onChange={addata} value={data.zipCode} name='zipCode' className="input-name" placeholder="Zip Code" />
                <input type="text" disabled={disab} onChange={addata} value={data.country} name='country' className="input-name" placeholder="Country" />
              </div>
            </div>

            <div className="form-group">
              <label className="reg_txt">Write Your qualification <span>*</span></label>
              <input maxLength={1000} type="text" disabled={disab} onChange={addata} value={data.qualification} name='qualification' className="form-register text" placeholder="" style={{ marginBottom: "15px" }} />
              {/* <!-- <input type="text" className="form-register text" id="" placeholder="Add your qualification"> <span><img alt="" src="images/plus.png" className="add"></span> --> */}
            </div>


            <div className="clearfix"></div>

            <div className="form-group">
              <label className="reg_txt">Comment  <span>*</span></label>
              <textarea   maxLength={1000}  disabled={disab} onChange={addata} value={data.comments} name='comments' className="form-register text" ></textarea>
            </div>

            <div className="form-group">
              <button type="submit" onClick={sub} className="btn btn-default submit" style={{ width: "97%" }}>Submit</button>
            </div>
          </form>

        </div>

        <div className="col-md-6 tabt">
          <table className="table">

            <tbody>
              <tr className="ztxt">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Edit</th>
                <th>Delete</th>
                <th>View</th>
              
              </tr>
              <tr><button className="ed" style={{ background: '#f00' }} 
              onClick={()=>{
              setproc('post')
              setdisab(false)
              setdata({...initstate});
              setincformat(p => {
                return ({ incemail: false, incphon: false, incount: false })
              })
              setmessage('')
              }

              } >Create</button></tr>

              {arr.map(a => {
                return (
                  <>
                    <tr key={a['_id']}>
                      <td>{a['firstName']}</td>
                      <td>{a['email']}</td>
                      <td>{a['phoneNumber']}</td>
                      <td><button className="ed" onClick={()=>autofil(a)}>Edit</button></td>
                      <td><button className="ed" style={{ background: '#f00' }} onClick={()=>deleteresource(a)}>Delete</button></td>
                      <td><button className="ed" style={{ background: '#000' }} onClick={()=>viewdata(a)}>
                        View</button></td>
                    </tr>
                  </>
                )
              })}


            </tbody>
          </table>
        </div>

      </div>

    </>
  );
}

export default App;
