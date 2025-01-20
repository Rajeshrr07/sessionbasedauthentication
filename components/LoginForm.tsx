'use client'
import React,{ useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMachine } from '@xstate/react';
import { createMachine } from 'xstate';
import { useRouter } from 'next/navigation'

const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'loggedOut',
  states:{
    loggedOut: {
      on: { TOGGLE: 'loggedIn' }
    },
    loggedIn: {
      on: { TOGGLE: 'loggedOut' }
    }
  }
})

export default function LoginPage() {
  const Router = useRouter()
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [csrfToken, setscrf] = useState<string | null>('')
  const [error, setError] = useState('');
  const [state, send] = useMachine(toggleMachine);


 

  React.useEffect(() => {
    fetch("https://18vsc7r5-8000.inc1.devtunnels.ms/account/csrf/", {
      credentials: "include",
      // headers: {
      //   "ngrok-skip-browser-warning": "56352",
      // }
    })
    .then((res) => {
      const csrfToken = res.headers.get("X-CSRFToken")
      setscrf(csrfToken);
    })
    .catch((err)=>{
      console.log(err)
    })
  }, [])
  function handleSubmit(e:React.FormEvent) {
    e.preventDefault();
    fetch("https://18vsc7r5-8000.inc1.devtunnels.ms/account/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({username: username, password: password}),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Connecting problem');
      }
    })
    .then((data) => {
      console.log(data);
      send({ type: "TOGGLE" }) 
      Router.push('/dashboard');
    })
    .catch((err) => {
      console.log(err);
      setError("Username or password Incorrect");
    });
  }
  console.log(state.value)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">User Name</Label>
              <Input
                id="username"
                type="tel"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <span className="text-red-500">{error}</span>
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

