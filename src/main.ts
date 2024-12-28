import P5 from 'p5'
import { Pane } from 'tweakpane'
import './style.css'


const sketch = (p: P5) => {
  const WIDTH = 480
  const HEIGHT = 480

  const settings = {
    scale: 1,
    speed: 0.1,
    color: '#fff',
    background: '#111',
  }

  const pane = new Pane()
  

  p.setup = () => {
    const c = p.createCanvas(WIDTH, HEIGHT)
    c.parent('app')

    const folder = pane.addFolder({ title: 'Settings' })
    folder.addBinding(settings, 'scale', { label: 'Scale', min: 0, max: 3, step: 0.1 })
    folder.addBinding(settings, 'speed', { label: 'Speed', min: 0.05, max: 0.2, step: 0.01 })
    folder.addBinding(settings, 'color', { label: 'Color', type: 'color' })
    folder.addBinding(settings, 'background', { label: 'Background', type: 'color' })
  }

  p.draw = () => {
    p.background(settings.background)

    p.push()
    p.noStroke()
    p.fill(settings.color)
    p.rectMode(p.CENTER)
    p.translate(p.width / 2, p.height / 2)
    p.scale(settings.scale)
    p.rotate(Math.sin(p.frameCount * settings.speed))
    p.rect(0, 0, 100, 100)
    p.pop()
  }
}

new P5(sketch)
