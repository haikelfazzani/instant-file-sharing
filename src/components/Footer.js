import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return <footer className="w-100 d-flex justify-between mt-3 text-uppercase">
    <small>Created with<i className="fa fa-heart ml-1 mr-1"></i>by <a href="https://haikel-fazzani.ml/"><small>Haikel Fazzani</small></a></small>

    <div>
      <a className="mr-1" href='/'><small><i className="fa fa-home mr-1"></i>Home</small></a>
      <Link to="/about"><i className='fa fa-info-circle mr-1'></i>About</Link>
    </div>
  </footer>
}
