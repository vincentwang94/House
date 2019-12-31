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
                         sphere4: new Subdivision_Sphere(4),
                         square: new Square(),
                         asix0: new Axis_Arrows(),
                         cylinder: new Cylindrical_Tube(1,20),
                       }
        this.submit_shapes( context, shapes );
        this.lock_flag = 0;
                                     
       // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } ),
            sun:      context.get_instance( Phong_Shader ).material( Color.of( 1 ,0, 1 ,1 ), { ambient: 1 } ),
            ground:   context.get_instance( Phong_Shader ).material( Color.of( 1 ,1, 1 ,0.5 ), { ambient: 1 } ),
            red_line:   context.get_instance( Phong_Shader ).material( Color.of( 1 ,0, 0 ,1 ), { ambient: 1 } ),
   
          }

        this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
      }
    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { /*
        this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location ); this.new_line();
        this.key_triggered_button( "Attach to planet 1", [ "1" ], () => this.attached = () => this.planet_1 );
        this.key_triggered_button( "Attach to planet 2", [ "2" ], () => this.attached = () => this.planet_2 ); this.new_line();
        this.key_triggered_button( "Attach to planet 3", [ "3" ], () => this.attached = () => this.planet_3 );
        this.key_triggered_button( "Attach to planet 4", [ "4" ], () => this.attached = () => this.planet_4 ); this.new_line();
        this.key_triggered_button( "Attach to planet 5", [ "5" ], () => this.attached = () => this.planet_5 );
        this.key_triggered_button( "Attach to moon",     [ "m" ], () => this.attached = () => this.moon     );
        */
      }

    draw_ground(graphics_state )
    {
        var model_transform; 
        for(var j=0; j<20; j++){
        model_transform = Mat4.identity().times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0)))
                                         .times(Mat4.translation(Vec.of(2*j,0,0)));
        this.shapes.square.draw( graphics_state, model_transform, this.materials.ground );
        for(var i=0; i<20; i++){ 
          model_transform = model_transform.times( Mat4.translation(Vec.of(0,2,0)));
          this.shapes.square.draw( graphics_state, model_transform, this.materials.ground );
        }
        model_transform = Mat4.identity().times(Mat4.translation(Vec.of(-2*j,0,0)));
      }
    }
    
    draw_red_lines(graphics_state)
    { 
      var model_transform;

      model_transform = Mat4.identity().times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
      for (var i=0; i<4; i++){
        model_transform = model_transform.times(Mat4.translation(Vec.of(0, 0, 20)))
                                             .times(Mat4.scale(Vec.of(.2, .2, 20)))
                                             ;
        this.shapes.cylinder.draw( graphics_state, model_transform, this.materials.red_line ); 
         
      }

      model_transform = Mat4.identity();
      for (var i=0; i<4; i++){
        model_transform = model_transform.times(Mat4.translation(Vec.of(0, 0, 20)))
                                             .times(Mat4.scale(Vec.of(.2, .2, 20)))
                                             ;
        this.shapes.cylinder.draw( graphics_state, model_transform, this.materials.red_line ); 
         
      }

    }

    draw_planets(graphics_state, model_transform, t)
    {
      var sun_radius = 2 + Math.sin(.4 * Math.PI * t);
      var RED = .5 + .5 * Math.sin(.4 * Math.PI * t);
      var BLUE =.5 + .5 * Math.sin(.4 * Math.PI * (t-2.5));
      

      //draw red lines
      this.draw_red_lines(graphics_state);
      //draw asix 
      this.shapes.asix0.draw( graphics_state, model_transform, this.materials.sun.override({color:Color.of(RED, 0, BLUE, 1)}) );          
      //draw ground 
      this.draw_ground(graphics_state);
     



   //   this.shapes.sphere4.draw( graphics_state, model_transform, this.materials.sun.override({color:Color.of(RED, 0, BLUE, 1)}) );
      this.lights = [new Light(Vec.of(0,0,0,1), Color.of( RED, 0, BLUE, 1 ), 10**sun_radius ) ];

      

    }

    display( graphics_state )
      {
        graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

        let model_transform = Mat4.identity();
        var blending_factor = 0.1 ;
        model_transform = this.draw_planets(graphics_state, model_transform, t);
      



      }

  }
