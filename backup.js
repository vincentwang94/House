window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { torus:  new Torus( 15, 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),
                         sphere1: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(1),
                         sphere2: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
                         sphere3: new Subdivision_Sphere(3),
                         sphere4: new Subdivision_Sphere(4)
                         Cylinder: new Cylindrical_Tube(2,2)
                        // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                        //        (Requirement 1)
                       }
        this.submit_shapes( context, shapes );
        this.lock_flag = 0;
                                     
       // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } ),
            ring:     context.get_instance( Ring_Shader  ).material(),
            sun:      context.get_instance( Phong_Shader ).material( Color.of( 1 ,0, 1 ,1 ), { ambient: 1 } ),
            //icy-grey
            planet1:  context.get_instance( Phong_Shader ).material( Color.of( 218/225, 228/225, 222/225, 1 ),{ambient: 0}, {diffusivity: .1}),
            //Swampy green-blue
            planet2:  context.get_instance( Phong_Shader ).material( Color.of( 163/225, 174/225, 126/225, 1 ),{ambient: 0}, {diffusivity: .1}, {specularity: 1} ),
            planet2_gourad:  context.get_instance( Phong_Shader ).material( Color.of( 163/225, 174/225, 126/225, 1 ),{ambient: 0}, {diffusivity: .1}, {specularity: 1}, {gourad: 1} ),
            //Muddy brown-orange                     
            planet3:  context.get_instance( Phong_Shader ).material( Color.of( 169/255, 132/255, 79/255, 1), {ambient: 0}, {diffusivity: 1}, {specularity: 1} ),
            //sofe light blue
            planet4:  context.get_instance( Phong_Shader ).material( Color.of( 173/255, 216/255, 230/255, 1), {ambient: 0}, {specularity: .9} ),
            //icy-grey too
            moon:     context.get_instance( Phong_Shader ).material( Color.of( 218/225, 228/225, 222/225, 1 ),{ambient: 0}, {diffusivity: .1}),
                                // TODO:  Fill in as many additional material objects as needed in this key/value table.
                                //        (Requirement 1)
          }

        this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
      }
    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location ); this.new_line();
        this.key_triggered_button( "Attach to planet 1", [ "1" ], () => this.attached = () => this.planet_1 );
        this.key_triggered_button( "Attach to planet 2", [ "2" ], () => this.attached = () => this.planet_2 ); this.new_line();
        this.key_triggered_button( "Attach to planet 3", [ "3" ], () => this.attached = () => this.planet_3 );
        this.key_triggered_button( "Attach to planet 4", [ "4" ], () => this.attached = () => this.planet_4 ); this.new_line();
        this.key_triggered_button( "Attach to planet 5", [ "5" ], () => this.attached = () => this.planet_5 );
        this.key_triggered_button( "Attach to moon",     [ "m" ], () => this.attached = () => this.moon     );
      }



    draw_planets(graphics_state, model_transform, t)
    {
      var sun_radius = 2 + Math.sin(.4 * Math.PI * t);
      var RED = .5 + .5 * Math.sin(.4 * Math.PI * t);
      var BLUE =.5 + .5 * Math.sin(.4 * Math.PI * (t-2.5));
      
      // draw the sun 
      model_transform = model_transform.times( Mat4.scale([sun_radius, sun_radius, sun_radius]));
      this.shapes.sphere4.draw( graphics_state, model_transform, this.materials.sun.override({color:Color.of(RED, 0, BLUE, 1)}) );
      this.lights = [new Light(Vec.of(0,0,0,1), Color.of( RED, 0, BLUE, 1 ), 10**sun_radius ) ];


      //first planet 
      model_transform = Mat4.identity().times( Mat4.translation([5 * Math.sin(t), 0, 5 * Math.cos(t)]));     
      this.shapes.sphere2.draw( graphics_state, model_transform, this.materials.planet1 );
      this.planet_1 = model_transform; //caputre the model_transform of planet1;

      //second planet 
      model_transform = Mat4.identity().times( Mat4.translation([8 * Math.sin(.8 * t), 0, 8 * Math.cos(.8 * t)]));
      if (t%2 == 1)     
        this.shapes.sphere3.draw( graphics_state, model_transform, this.materials.planet2_gourad );
      else 
        this.shapes.sphere3.draw( graphics_state, model_transform, this.materials.planet2);
      this.planet_2 = model_transform; 

      //third planet 
      model_transform = Mat4.identity().times( Mat4.translation([11 * Math.sin(.6 * t), 0, 11 * Math.cos(.6 * t)]));   
      model_transform = model_transform.times( Mat4.translation([1.5* Math.sin(4*t), 0, 1.5* Math.cos(4*t)] ) );
      this.shapes.sphere4.draw( graphics_state, model_transform, this.materials.planet3 );
      this.planet_3 = model_transform;   
      model_transform = model_transform.times( Mat4.scale([1, 1, .01]));
      this.shapes.torus2.draw( graphics_state, model_transform, this.materials.planet3 );
     
     //fourth planet
     model_transform = Mat4.identity().times( Mat4.translation([14 * Math.sin(.4 * t), 0, 14 * Math.cos(.4 * t)]));   
     this.shapes.sphere4.draw(graphics_state, model_transform, this.materials.planet4 );
     this.planet_4 = model_transform;

     //moon
     model_transform = model_transform.times( Mat4.translation([1.5* Math.sin(20*t), 0, 1.5* Math.cos(20*t)] ) );
     this.shapes.sphere1.draw(graphics_state, model_transform, this.materials.moon );
     this.moon = model_transform;


    }

    display( graphics_state )
      {
        graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

        let model_transform = Mat4.identity();
        model_transform = this.draw_planets(graphics_state, model_transform, t);
        if(this.attached != undefined) {
          var desired = Mat4.inverse(this.attached().times(Mat4.translation([0,0,5])));
          graphics_state.camera_transform = desired;
        }

        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 2 and 3)

      //  this.shapes.torus2.draw( graphics_state, Mat4.identity(), this.materials.test );

      }

  }


// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
{ material() { return { shader: this } }      // Materials here are minimal, without any settings.
  map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
    {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
                                                  // which kinds of Shapes this Shader is compatible with.  Thanks to this function, 
                                                  // Vertex buffers in the GPU can get their pointers matched up with pointers to 
                                                  // attribute names in the GPU.  Shapes and Shaders can still be compatible even
                                                  // if some vertex data feilds are unused. 
      return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
                                                                                        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        { 
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return `
        void main()
        { 
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
    }
}

window.Grid_Sphere = window.classes.Grid_Sphere =
class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at 
  { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
      { super( "positions", "normals", "texture_coords" );
        

                      // TODO:  Complete the specification of a sphere with lattitude and longitude lines
                      //        (Extra Credit Part III)
      } 
  }







