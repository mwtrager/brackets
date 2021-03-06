import React, { Component } from 'react'
import AuthService from '../utils/AuthService'
import { emailRegex } from '../utils/constants'
import T from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: auto;
`

const FormField = styled.div`
  display: block;
  padding-top: 1em;
`

const Label = styled.label`
  display: block;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 5px;
`

const Alert = styled.div`
  color: red;
`

const Input = styled.input`
  border: none;
  padding: 0.5em;
  color: black;
  background-color: lightcyan;
`

const InputButton = styled.input`
  padding-top: 10px;
`

const Bueno = styled.h3`
  font-weight: bold;
`

class SignUpForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password1: '',
      password2: '',
      emailInUse: false
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  handleInputChange (event) {
    const { name, value } = event.target
    this.setState({[name]: value})
  }

  handleSubmit (event) {
    event.preventDefault()

    if (this.bueno()) {
      const { auth } = this.props
      const s = this.state
      const user = {
        name: s.name,
        email: s.email,
        password: s.password1
      }
      auth.signup(user).then(user => {
        console.log('user created')
        console.log(user)
        this.context.router.history.push('./main')
      })
      .catch(err => {
        if (err) this.setState({emailInUse: true})
      })
    }
  }

  checkName (name) {
    return name.length > 1 && name.length < 20
  }

  checkEmail (email) {
    return email.match(emailRegex)
  }

  checkPassword (pw) {
    return pw.length > 5 && pw.length < 20
  }

  checkPasswordMatch (pw1, pw2) {
    return pw1 === pw2
  }

  bueno () {
    const { name, email, password1, password2 } = this.state
    return (
      this.checkName(name) &&
      this.checkEmail(email) &&
      this.checkPassword(password1) &&
      this.checkPassword(password2) &&
      this.checkPasswordMatch(password1, password2)
    )
  }

  render () {
    let bueno = this.bueno()
    let output = bueno ? 'bueno, good form' : 'no bueno, bad form'
    let emailAlert = this.state.emailInUse ? 'email is in use' : '' // TODO this is ugly?

    return (
      <Wrapper>
        <form onSubmit={this.handleSubmit}>
          <FormField>
            <Label>Name</Label>
            <Input
              type='text'
              name='name'
              placeholder='Enter your name'
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </FormField>
          <FormField>
            <Alert>{emailAlert}</Alert>
            <Label>Email</Label>
            <Input
              type='text'
              name='email'
              placeholder='Enter your email'
              value={this.state.email}
              onChange={this.handleInputChange}
            />
          </FormField>
          <FormField>
            <Label>Password</Label>
            <Input
              type='password'
              name='password1'
              placeholder='Enter your password'
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </FormField>
          <FormField>
            <Label>Confirm Password</Label>
            <Input
              type='password'
              name='password2'
              placeholder='Confirm your password'
              value={this.state.password2}
              onChange={this.handleInputChange}
            />
          </FormField>
          <FormField>
            <InputButton
              type='submit'
              value='Submit'
              disabled={!bueno}
            />
          </FormField>
        </form>
        <Bueno>{output}</Bueno>
      </Wrapper>
    )
  }
}

export default SignUpForm
