import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/why')({
  component: Why,
})

function Why() {

  return (
    <div>
      <h2 className='text-2xl font-bold mb-8'>Why?</h2>
      <p className='mb-2'>My name is Sara and I go into weird wikipedia holes and I usually forget these after a week and then will go into the same holes again.</p>
        <p className='mb-2'>I want to fix that and so I made this small website.</p>
        <p className='mb-2'>I have ADHD if that wasn't obvious</p>

  </div>
  )
}
